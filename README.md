# Laboratorio di piattaforme e metodologie cloud - AA 2024-25
Applicazione demo per laboratori di deploy su Google Cloud Platform.

|Versione App|Lezione di riferimento|
|-|-|
|1|Lezione 2 - Virtualizzazione e IaaS|
|||

## Deploy A - Su istanza Compute Engine
1. Creare una nuova istanza Compute Engine con le seguenti caratteristiche:
    - appserver as instance name
    - Region us-central1
    - Zone us-central1-a
    - e2-micro Instance
    - Spot provisioning model
    - 10 GB Persistent Disk
    - Debian 12 operating system
    - HTTP & HTTPS traffic allowed
2. Collegarsi alla VM via SSH
3. Eseguire i seguenti comandi per l'installazione ed esecuzione di CalculusMaster
```sh
# Aggiornamento repository
sudo apt-get update
# Installazione git
sudo apt-get install -yq git

# Installazione node.js (estratto da https://cloud.google.com/nodejs/getting-started/getting-started-on-compute-engine?hl=it)
sudo mkdir /opt/nodejs
curl https://nodejs.org/dist/v20.11.0/node-v20.11.0-linux-x64.tar.gz | sudo tar xvzf - -C /opt/nodejs --strip-components=1
sudo ln -s /opt/nodejs/bin/node /usr/bin/node
sudo ln -s /opt/nodejs/bin/npm /usr/bin/npm

# Clonazione repository CalculusMaster Versione 1
git clone https://github.com/dluppoli/CalculusMasterV1
cd CalculusMasterV1

# Creazione del file di environment. Personalizzare i valori secondo le necessità 
cat > .env << EOF
#Server config
PORT=80
EOF

# Esecuzione applicazione
npm install
sudo npm start
```
4. Collegarsi all'ip pubblico della VM e verificare il corretto funzionamento

## Deploy B - Custom Image
Per la creazione dell'immagine eseguire i seguenti passi
1. Entrare nel dettaglio dell'istanza appserver
2. Selezionare "Create Machine Image"
3. Assegnare il nome appserverimage
4. Scegliere Location Regional in us-central1
5. Cliccare su Crea
6. In alternativa utilizzare il seguente comando il cloud shell `gcloud compute machine-images create appserverimage --source-instance=appserver --source-instance-zone=us-central1-a --storage-location=us-central1`

Per la creazione di una nuova istanza partendo dall'immagine precedentemente creata
1. Da cloud console andando nel menù Machine Images, selezionando l'immagine appserverimage e selezionando "Create Instance"
2. Da Cloud shell con il comando `gcloud compute instances create appserver2 --source-machine-image=appserverimage`

## Deploy C - Disco Dati
1. Creazione di un nuovo Persistent disk da cloud console, attivando anche la creazione schedulata di snapshots:
    - name: datadisk
    - location: Single zone us-central1-a
    - disk type: Standard
    - size: 10GB
2. Collegare il nuovo disco alla VM via cloud shell: `gcloud compute instances attach-disk appserver --disk=datadisk --zone=us-central1-a`
3. Collegarsi all'istanza appserver via SSH per formattazione, mount del disco e spostamento applicazione
```sh
# Identificazione del nuovo disco (dovrebbe essere sdb)
lsblk
# Verifica dello stato di non formattato
sudo file -s /dev/sdb
# Formattazione
sudo mkfs.ext4 -F /dev/sdb

# Creazione directory di mounting e mount nuovo disco
sudo mkdir /appdata
sudo mount /dev/sdb /appdata
sudo cp -r CalculusMasterV1 /appdata
rm -rf CalculusMasterV1
cd /appdata/CalculusMasterV1

# Avvio applicazione
sudo npm start
``` 
4. Modificare il file /etc/fstab per il mount automatico del nuovo disco:
    - Identificare l'UUID del nuovo disco con `sudo ls -l /dev/disk/by-uuid/`
    - Editare il file /etc/fstab con `sudo nano /etc/fstab` accodando la riga:
```txt
UUID=__id_trovato_al _punto_precedente__ /appdata ext4 defaults 0 0
```
5. Modificare lo startup script per avviare automaticamente l'applicazione
```sh
cd /appdata/CalculusMasterV1
sudo npm start
```
6. Creare una nuova immagine dell'istanza appserver tramite cloud shell
```sh
# Spegnere la macchina virtuale
gcloud compute instances stop appserver --zone=us-central1-a

# Scollegare il disco dati
gcloud compute instances detach-disk appserver --disk=datadisk --zone=us-central1-a

# Creare l'immagine
gcloud compute machine-images create appserverimage2 --source-instance=appserver --source-instance-zone=us-central1-a

# Ricollegare il disco dati
gcloud compute instances attach-disk appserver --disk=datadisk --zone=us-central1-a

# Avviare l'istanza
gcloud compute instances start appserver --zone=us-central1-a
```
7. Simulare il ripristino del disco dati da snapshot
```sh
# Forzare la creazione di uno snapshot
gcloud compute disks snapshot datadisk --zone=us-central1-a --snapshot-names=sn1 --storage-location=us-central1

# Creare un nuovo disco a partire dallo snapshot
gcloud compute disks create datadisk2 --source-snapshot=sn1 --zone=us-central1-a

# Scollegare datadisk e collegare datadisk2
gcloud compute instances detach-disk appserver --disk=datadisk --zone=us-central1-a
gcloud compute instances attach-disk appserver --disk=datadisk2 --zone=us-central1-a
```

## Deploy A con Terraform
1. Caricare il file `startup_script_deployA.sh` in un bucket Cloud Storage esistente o in uno nuovo appositamente creato
2. Entrare nella cartella `terraform` contenente i file dell'infrastruttura
3. Editare il file `terraform.tfvars` impostando l'id del progetto GCP e l'indirizzo gs:// del file caricato al punto 1
4. Eseguire i seguenti comandi terraform
```sh
terraform init
terraform validate
terraform plan
terraform apply
```
5. Verificare il corretto funzionamento dell'infrastruttura creata
6. Cancellare l'infrastruttura con `terraform destroy`
