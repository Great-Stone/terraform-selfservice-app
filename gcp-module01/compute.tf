resource "google_compute_firewall" "default" {
  name    = "${var.prefix}-firewall"
  network = data.google_compute_network.vpc-network.name

  allow {
    protocol = "icmp"
  }

  allow {
    protocol = "tcp"
    ports = [
      "80",
      "443",
      "6443",
      "8001",
      "8080"
    ]
  }

  source_ranges = ["0.0.0.0/0"]
  source_tags   = ["template"]
}

resource "google_compute_instance" "compute_instance" {
  name         = "${var.prefix}-compute-instance"
  machine_type = var.machine_type
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = var.boot_disk
    }
  }

  network_interface {
    network = data.google_compute_network.vpc-network.name
    access_config {
    }
  }
}