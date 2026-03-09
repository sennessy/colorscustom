# Mise en ligne ColorsCustom (Ubuntu 22.04/24.04)

## 1) Build local

Depuis le projet:

```bash
./mvnw -q -DskipTests package
ls -lh target/colorcustoms-0.0.1-SNAPSHOT.jar
```

## 2) Copie sur le serveur

Depuis ton Mac (adapte user/IP):

```bash
scp target/colorcustoms-0.0.1-SNAPSHOT.jar user@SERVER_IP:/tmp/colorcustoms.jar
scp ops/systemd/colorscustom.service user@SERVER_IP:/tmp/colorscustom.service
scp ops/nginx/colorscustom.conf user@SERVER_IP:/tmp/colorscustom.conf
scp ops/.env.production.example user@SERVER_IP:/tmp/colorscustom.env
```

## 3) Préparation serveur

Connecte-toi au serveur:

```bash
ssh user@SERVER_IP
```

Installe Java/Nginx/Certbot:

```bash
sudo apt update
sudo apt install -y openjdk-21-jre nginx certbot python3-certbot-nginx
```

Crée les dossiers:

```bash
sudo mkdir -p /opt/colorscustom
sudo mv /tmp/colorcustoms.jar /opt/colorscustom/colorcustoms.jar
sudo mv /tmp/colorscustom.env /opt/colorscustom/.env
sudo chown -R www-data:www-data /opt/colorscustom
sudo chmod 640 /opt/colorscustom/.env
```

Edite l'env de production:

```bash
sudo nano /opt/colorscustom/.env
```

Variables minimales:

```env
APP_BASE_URL=https://colorscustom.ch
CHECKOUT_SIMULATION_ENABLED=false
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
JAVA_OPTS=-Xms256m -Xmx512m
SERVER_PORT=8080
```

## 4) Service systemd

```bash
sudo mv /tmp/colorscustom.service /etc/systemd/system/colorscustom.service
sudo systemctl daemon-reload
sudo systemctl enable colorscustom
sudo systemctl restart colorscustom
sudo systemctl status colorscustom --no-pager
```

Logs:

```bash
sudo journalctl -u colorscustom -f
```

## 5) Nginx + HTTPS

Copie la conf Nginx:

```bash
sudo mv /tmp/colorscustom.conf /etc/nginx/sites-available/colorscustom
```

Active le site:

```bash
sudo ln -sf /etc/nginx/sites-available/colorscustom /etc/nginx/sites-enabled/colorscustom
sudo nginx -t
sudo systemctl reload nginx
```

Génère le certificat SSL:

```bash
sudo certbot --nginx -d colorscustom.ch -d www.colorscustom.ch
```

## 6) Webhook Stripe

Dans Stripe Dashboard:
- Webhook endpoint: `https://colorscustom.ch/stripe/webhook`
- Event: `checkout.session.completed`

Puis mets le secret `whsec_...` dans `/opt/colorscustom/.env`, ensuite:

```bash
sudo systemctl restart colorscustom
```

## 7) Vérifications finales

```bash
curl -I https://colorscustom.ch/
curl -I https://colorscustom.ch/boutique
curl -I https://colorscustom.ch/contact
```

Si tout est OK:

```bash
sudo systemctl is-active colorscustom
sudo systemctl is-active nginx
```
