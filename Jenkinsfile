pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "ems-project"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Thanux-yongyang/Emp-Management.git'
            }
        }

        stage('Build and Start Containers') {
            steps {
                script {
                    sh 'docker compose build'
                    sh 'docker compose down'
                    sh 'docker compose up -d'
                }
            }
        }

        stage('wait for backend to be healthy') {
            steps {
                echo 'Waiting for backend to be healthy...'
                sh '''
                    for i in {1..20}; do 
                        if docker exec $(docker ps -qf "name=${COMPOSE_PROJECT_NAME}-backend") curl -s http://localhost:8080/actuator/health | grep '"status":"UP"' ; then 
                            echo "Backend is healthy!"
                            break
                        fi
                        echo "Waiting for backend to be healthy..."
                        sleep 5
                    done
                '''
            }
        }

        stage('Finally') {
            steps {
                echo 'Docker is running.'
            }
        }
    }
}

