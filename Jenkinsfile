/*
pipeline {
    agent {
        docker {
            image 'node:8'
           // args '-u root:root --name=alice -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p 18543:18332'
            // args '--tmpfs /.config'
            }
        }
    stages {
        stage('build') {
            steps {
                   sh 'npm --version'
                   //sh './contrib/scripts/check-alice.sh'
                   docker.image('python:2.7').withRun('-u root --entrypoint /bin/bash') {
                       sh 'pip install version'
                   }
            }
        }
    }
}
*/
node {
    checkout scm

    docker.image("doichain/node-only").withRun("-it --name=alice -e REGTEST=true -e RPC_ALLOW_IP=::/0 -p 18545:18445 -p 18543:18443 -e RPC_PASSWORD=generated--password -e RPC_HOST=localhost -e DAPP_HOST=alice -e DAPP_SMTP_HOST=localhost -e DAPP_SMTP_USER=doichain -e DAPP_SMTP_PASS='doichain-mail-pw!' -e DAPP_SMTP_PORT=25 -e CONFIRM_ADDRESS=xxx -e DEFAULT_FROM='reply@your-domain.com'") { c ->
                    sh 'docker logs alice'
                    sh 'sleep 10'
                    sh 'docker logs alice'
                    sh './contrib/scripts/check-alice.sh'
                   // sh 'while ! lsof -i TCP:18445 | grep LISTEN; do sleep 1; done'
                    echo "running with doichain docker image alice"
                    sh 'sleep 30'
                    echo "finished alice"
    }
}