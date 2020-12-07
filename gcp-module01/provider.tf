locals {
  credentials = var.credentials == "" ? file(var.credentials_file) : var.credentials
}

provider "google" {
  credentials = local.credentials

  project = var.project
  region  = var.region
}