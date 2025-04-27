# variables.tf
variable "aws_region" {
  description = "The AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "restaurant-app"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "availability_zones" {
  description = "Availability zones for the subnets"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "ami_id" {
  description = "AMI ID for EC2 instances (Amazon Linux 2 recommended)"
  type        = string
  default     = "ami-0c55b159cbfafe1f0" # Update with a valid Amazon Linux 2 AMI ID
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "SSH key pair name"
  type        = string
  default     = "clouddev" # Update with your key pair name
}

variable "asg_max_size" {
  description = "Maximum size of the Auto Scaling Group"
  type        = number
  default     = 3
}

variable "asg_min_size" {
  description = "Minimum size of the Auto Scaling Group"
  type        = number
  default     = 1
}

variable "asg_desired_capacity" {
  description = "Desired capacity of the Auto Scaling Group"
  type        = number
  default     = 2
}

variable "git_repo_url" {
  description = "Git repository URL for the MERN application"
  type        = string
  default     = "https://github.com/zainabfatimaaa/clouddev_project.git" # Update with your repo URL
}

variable "git_branch" {
  description = "Git branch to deploy"
  type        = string
  default     = "main"
}