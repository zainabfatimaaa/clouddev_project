# terraform.tfvars
aws_region         = "us-east-1"
project_name       = "mern-dynamodb-app"
vpc_cidr           = "10.0.0.0/16"
public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
availability_zones = ["us-east-1a", "us-east-1b"]
ami_id             = "ami-0a3c3a20c09d6f377" # Update with a valid Amazon Linux 2 AMI ID for your region
instance_type      = "t2.micro"
key_name           = "clouddev" # Replace with your actual key pair name
asg_max_size       = 3
asg_min_size       = 1
asg_desired_capacity = 2
git_repo_url       = "https://github.com/zainabfatimaaa/clouddev_project.git" # Replace with your repo URL
git_branch         = "main"