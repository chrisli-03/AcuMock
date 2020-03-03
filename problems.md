Problems while hosting app on aws Node.js instance

1. Problem: port 80 already used by Bitnami welcome page

   Solution: Login to terminal, use `sudo /opt/bitnami/ctlscript.sh stop` to turn off Bitnami welcom page.

2. Problem: Error permission denied 0.0.0.0:80

   Solution: Must use `sudo` to host on port 80

3. Problem: `sudo node index.js` works but `sudo pm2 start index.js` still shows permission denied.

   Solution: pm2 already running with no privilege, use `pm2 kill` to stop, then `sudo pm2 start index.js` to host with privilege.

4. Problem: Accessing state immediately after updating will still use the old state.

   Solution: still have no idea how to solve this, maybe just avoid it.

4. Problem: Docker-Compose Nginx error: connect() failed(111: Connection refused) while connecting to upstream

   Solution: instead of `proxy_pass: localhost` use `proxy_pass: container_name` where container_name is the name of container in docker-compose.yml
