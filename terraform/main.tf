module "vpc" {
  source = "./vpc"

  project = var.project
  region = var.region
  zone = var.zone
}

module "vm" {
  source = "./vm"

  project = var.project
  region = var.region
  zone = var.zone

  vpc_name = module.vpc.vpc_name
  startupscripturl = var.startupscripturl
}