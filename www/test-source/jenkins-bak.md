pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                script {
                    git branch: 'main', credentialsId: 'test-jenkins-id', url: 'https://github.com/longnguyen97-full/hello-jenkins.git'
                }
            }
        }
        stage('Deploy Production') {
            steps {
                script {
                        #!/bin/sh
                        GIT=`which git`
                        REPO_DIR=/var/www/html/hello-jenkins
                        cd ${REPO_DIR}
                        ${GIT} add --all .
                        ${GIT} commit -m "Test commit"
                        ${GIT} push git@github.com:longnguyen97-full/hello-jenkins.git main
                }
            }
        }
    }
}

#!/bin/sh
GIT=`which git`
REPO_DIR=/var/www/html/push-jenkins
cd ${REPO_DIR}
${GIT} add --all .
${GIT} commit -m "Deploy production..."
${GIT} push git@github.com:longnguyen97-full/hello-jenkins.git main

---

    node {
      String credentialsId="permakey"
      String gitRepo="ssh://git@github.com:longnguyen97-full/hello-jenkins.git"
      stage "Test Tag Push"
      git credentialsId: "${credentialsId}", url: "${gitRepo}"
      tagName="MyTag"
      sh(script: "git tag $tagName")
      sshagent([credentialsId]) {
        sh(script: 'git push --tags')
      }
    }

---
withCredentials([sshUserPrivateKey(credentialsId: 'permakey', keyFileVariable: 'GITHUB_KEY')]) {
    sh 'echo ssh -i $GITHUB_KEY -l git -o StrictHostKeyChecking=no \\"\\$@\\" > run_ssh.sh'
    sh 'chmod +x run_ssh.sh'
    withEnv(['GIT_SSH=run_ssh.sh']) {
        sh '''#!/bin/sh
        GIT=`which git`
        REPO_DIR=/var/www/html/hello-jenkins
        cd ${REPO_DIR}
        ${GIT} add --all .
        ${GIT} commit -m "Deploy production..."
        ${GIT} push https://longnguyen97-full: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@hello-jenkins.git --all main'''
    }
}