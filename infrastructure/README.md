# StarBook Infrastructure

Infrastructure as Code (IaC) using Terraform for AWS deployment.

## Architecture

- **VPC**: Isolated network with public and private subnets
- **S3**: Media storage and static website hosting
- **CloudFront**: CDN for global content delivery
- **ECS**: Container orchestration for the webapp
- **RDS PostgreSQL**: Relational database
- **ALB**: Application Load Balancer
- **ECR**: Container registry

## Prerequisites

- Terraform >= 1.5.0
- AWS CLI configured with credentials
- AWS account with appropriate permissions

## Quick Start

1. **Copy the example variables file:**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Edit `terraform.tfvars` with your values:**
   ```bash
   vim terraform.tfvars
   ```

3. **Initialize Terraform:**
   ```bash
   terraform init
   ```

4. **Review the plan:**
   ```bash
   terraform plan
   ```

5. **Apply the infrastructure:**
   ```bash
   terraform apply
   ```

## Resources Created

### Networking
- VPC with public and private subnets
- Internet Gateway
- NAT Gateway
- Route tables and associations

### Storage
- S3 bucket for media files (with encryption, versioning)
- S3 bucket for static website hosting
- CloudFront distribution (optional)

### Compute
- ECS cluster
- ECR repository for Docker images
- Application Load Balancer
- Security groups

### Database
- RDS PostgreSQL instance
- DB subnet group
- Secrets Manager for credentials

### Security
- Security groups for ALB, ECS, and RDS
- IAM roles and policies
- AWS WAF (optional)

## Outputs

After applying, Terraform will output:

- S3 bucket names
- CloudFront distribution domain
- VPC ID
- Database endpoint
- ECR repository URL
- ALB DNS name

View outputs:
```bash
terraform output
```

## Environments

Configure different environments using workspaces:

```bash
# Create/switch to production
terraform workspace new production
terraform workspace select production

# Apply with production variables
terraform apply -var-file="production.tfvars"
```

## Remote State (Recommended for Production)

1. Create S3 bucket and DynamoDB table for state management
2. Uncomment the backend configuration in `main.tf`
3. Run `terraform init -migrate-state`

## Deployment

### Deploy the Webapp

1. **Build and push Docker image:**
   ```bash
   # Get ECR login
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ecr-url>

   # Build image
   docker build -t starbook-webapp ../packages/webapp

   # Tag and push
   docker tag starbook-webapp:latest <ecr-url>/starbook-app-dev:latest
   docker push <ecr-url>/starbook-app-dev:latest
   ```

2. **Create ECS task definition and service** (see `ecs-task-definition.json` example)

### Deploy the Website

```bash
cd ../packages/website
npm run build
aws s3 sync out/ s3://starbook-website-dev/
```

## Cost Optimization

For development:
- Use `db.t3.micro` for RDS
- Disable CloudFront (`enable_cdn = false`)
- Use single NAT Gateway
- Delete resources when not in use: `terraform destroy`

For production:
- Use Multi-AZ RDS
- Enable CloudFront
- Enable WAF
- Set up monitoring and alerts

## Security Best Practices

- [ ] Enable MFA on AWS account
- [ ] Use least-privilege IAM policies
- [ ] Enable CloudTrail for audit logging
- [ ] Rotate database credentials regularly
- [ ] Enable VPC Flow Logs
- [ ] Use AWS Config for compliance
- [ ] Enable GuardDuty for threat detection

## Monitoring

Set up CloudWatch alarms for:
- ECS CPU/Memory usage
- RDS connections and performance
- ALB target health
- S3 bucket size
- CloudFront error rates

## Troubleshooting

**Issue: Terraform state locked**
```bash
# View locks
terraform force-unlock <lock-id>
```

**Issue: Resource already exists**
```bash
# Import existing resource
terraform import aws_s3_bucket.media starbook-media-dev
```

**Issue: Apply fails**
- Check AWS credentials and permissions
- Verify variable values in `terraform.tfvars`
- Review error messages and adjust resources

## Clean Up

To destroy all resources:
```bash
terraform destroy
```

**Warning:** This will delete all data. Make backups first!

## Documentation

- [AWS VPC Best Practices](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-best-practices.html)
- [ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/intro.html)
- [RDS Security](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.html)
