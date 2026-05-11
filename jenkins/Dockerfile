FROM jenkins/jenkins:lts-jdk17

USER root

# Install Docker CLI + Compose plugin so the pipeline can build/run containers
# via the host's docker daemon (mounted at /var/run/docker.sock).
RUN apt-get update && apt-get install -y \
        ca-certificates curl gnupg lsb-release git \
    && install -m 0755 -d /etc/apt/keyrings \
    && curl -fsSL https://download.docker.com/linux/debian/gpg \
        | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
    && chmod a+r /etc/apt/keyrings/docker.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
        https://download.docker.com/linux/debian $(lsb_release -cs) stable" \
        > /etc/apt/sources.list.d/docker.list \
    && apt-get update && apt-get install -y \
        docker-ce-cli docker-compose-plugin \
    && rm -rf /var/lib/apt/lists/*

# Pre-install commonly used Jenkins plugins (skip the setup wizard manually
# in the UI on first boot, or use JCasC if you prefer fully unattended setup).
RUN jenkins-plugin-cli --plugins \
        git \
        workflow-aggregator \
        pipeline-stage-view \
        credentials-binding \
        docker-workflow \
        blueocean \
        configuration-as-code \
        timestamper \
        ws-cleanup

USER jenkins