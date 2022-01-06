variable "project" {
  default = "hc-ab134eb71a944b4ca489963a70b"
}
variable "multi_region" {
  default = "ASIA"
}
variable "region" {
  default = "asia-northeast3"
}
variable "zone" {
  default = "asia-northeast3-a"
}
variable "credentials" {
  default = ""
}
variable "credentials_file" {
  default = "../credentials.json"
}

/*
  Global
*/
variable "prefix" {
  type = string
}

/*
  Compute
*/
variable "machine_type" {
  type = string
  default = "f1-micro"
}
variable "boot_disk" {
  type = string
  default = "centos-7"
}

/*
  Cloud SQL
*/
variable "sql_machine_type" {
  type = string
  default = "db-f1-micro"
}
variable "database_version" {
  type = string
  default = "MYSQL_5_6"
}

/*
  Cloud Storage Bucket
*/
