// resource "google_compute_network" "vpc_network" {
//   name = "${var.prefix}-vpc-network"
// }

data "google_compute_network" "vpc-network" {
  name = "default"
}