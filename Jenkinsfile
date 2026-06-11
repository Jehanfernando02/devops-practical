pipeline {
    agent any

    // ── Trigger: GitHub webhook fires this automatically on every push ─────────
    // Setup: GitHub repo → Settings → Webhooks → http://<JENKINS_IP>:8080/github-webhook/
    // Jenkins job → "Build Triggers" → check "GitHub hook trigger for GITScm polling"
    triggers {
        githubPush()
    }

    options {
        timestamps()                        // prefix every log line with a timestamp
        timeout(time: 15, unit: 'MINUTES')  // abort if the build hangs
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        COMPOSE_PROJECT_NAME = 'devops-practical'
        DEPLOY_DIR           = '/home/ubuntu/devops-practical'
        COMPOSE_FILES        = '-f docker-compose.yml'
        APP_VERSION          = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
    }

    stages {

        stage('Checkout') {
            steps {
                echo "📥 Checking out commit ${env.GIT_COMMIT?.take(7) ?: 'unknown'} on ${env.GIT_BRANCH ?: 'master'}"
                checkout scm
            }
        }

        stage('Backend Tests') {
            steps {
                echo "🧪 Running PHPUnit tests inside an isolated Docker container..."
                sh '''
                    set -e

                    docker build -t devopspractical-test -f Dockerfile .

                    docker run --rm \
                        -e APP_ENV=testing \
                        -e APP_KEY=base64:test1234567890123456789012345678 \
                        -e DB_CONNECTION=sqlite \
                        -e DB_DATABASE=:memory: \
                        -e CACHE_STORE=array \
                        -e SESSION_DRIVER=array \
                        -e QUEUE_CONNECTION=sync \
                        -e MAIL_MAILER=array \
                        devopspractical-test \
                        sh -c "composer install --no-interaction --prefer-dist && php artisan config:clear && php artisan test"

                    echo "✅ All tests passed"
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo "🚀 Deploying to production (commit: ${env.APP_VERSION})..."
                sh '''
                    cd $DEPLOY_DIR
                    git fetch origin main
                    git reset --hard origin/main
                '''
                sh '''
                    cd $DEPLOY_DIR

                    docker compose $COMPOSE_FILES build app frontend
                    docker compose $COMPOSE_FILES up -d --remove-orphans

                    echo "⏳ Waiting for containers to be healthy..."
                    sleep 10

                    docker compose $COMPOSE_FILES exec -T app php artisan migrate --force
                    docker compose $COMPOSE_FILES exec -T app php artisan config:clear
                    docker compose $COMPOSE_FILES exec -T app php artisan cache:clear
                    docker compose $COMPOSE_FILES exec -T app php artisan config:cache
                    docker compose $COMPOSE_FILES exec -T app php artisan route:cache

                    docker compose $COMPOSE_FILES restart nginx frontend

                    echo "🏥 Verifying deployment via health check..."
                    sleep 5
                    curl -sf http://localhost/api/health && echo "✅ Health check passed" || echo "⚠️  Health check returned non-200"
                '''
            }
        }

        stage('Cleanup') {
            steps {
                echo "🧹 Pruning dangling Docker images..."
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo """
╔══════════════════════════════════════════╗
║  ✅  DEPLOYMENT SUCCESSFUL               ║
║  Build   : #${env.BUILD_NUMBER}                    ║
║  Commit  : ${env.APP_VERSION}                      ║
║  Live at : http://51.20.252.1/           ║
╚══════════════════════════════════════════╝
"""
        }
        failure {
            echo """
╔══════════════════════════════════════════╗
║  ❌  PIPELINE FAILED                    ║
║  Build  : #${env.BUILD_NUMBER}                     ║
║  Check the logs above for details.       ║
║  Production left on the previous version.║
╚══════════════════════════════════════════╝
"""
        }
        always {
            echo "📊 Build #${env.BUILD_NUMBER} completed with status: ${currentBuild.currentResult}"
        }
    }
}