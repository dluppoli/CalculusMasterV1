resource "google_compute_instance" "default" {
    name         = "appserver"
    machine_type = "e2-micro"
    tags = ["web"]
    scheduling {
      provisioning_model = "SPOT"
      automatic_restart = false
      preemptible = true
    }

    boot_disk {
        initialize_params {
            size = 10
            image = "debian-cloud/debian-12"
        }
    }

    network_interface {
        network = var.vpc_name
        access_config {}
    }

    metadata = {
        startup-script-url = var.startupscripturl
    }

    service_account {
        scopes = ["cloud-platform"]
    }
}