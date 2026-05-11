pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'devopspractical'
        DEPLOY_DIR = '/home/ubuntu/devops-practical'
        COMPOSE_FILES = '-f docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Tests') {
            steps {
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
                '''
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([gitUsernamePassword(credentialsId: 'github-creds', gitToolName: 'Default')]) {
                    sh '''
                        cd $DEPLOY_DIR
                        git fetch origin master
                        git reset --hard origin/master
                    '''
                }
                sh '''
                    cd $DEPLOY_DIR
                    docker compose $COMPOSE_FILES build app frontend
                    docker compose $COMPOSE_FILES up -d --remove-orphans

                    sleep 10

                    docker compose $COMPOSE_FILES exec -T app php artisan migrate --force
                    docker compose $COMPOSE_FILES exec -T app php artisan config:clear
                    docker compose $COMPOSE_FILES exec -T app php artisan cache:clear
                    docker compose $COMPOSE_FILES exec -T app php artisan config:cache
                    docker compose $COMPOSE_FILES exec -T app php artisan route:cache

                    docker compose $COMPOSE_FILES restart nginx frontend
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed. Production was left on the previous running version.'
        }
        success {
            echo 'Deploy OK.'
        }
    }
}