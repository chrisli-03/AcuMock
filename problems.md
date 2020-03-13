Problems while hosting app on aws Node.js instance

1. Problem: port 80 already used by Bitnami welcome page

   Solution: Login to terminal, use `sudo /opt/bitnami/ctlscript.sh stop` to turn off Bitnami welcome page.

2. Problem: Error permission denied 0.0.0.0:80

   Solution: Must use `sudo` to host on port 80

3. Problem: `sudo node index.js` works but `sudo pm2 start index.js` still shows permission denied.

   Solution: pm2 already running with no privilege, use `pm2 kill` to stop, then `sudo pm2 start index.js` to host with privilege.

4. Problem: Accessing state immediately after updating will still use the old state.

   Solution: still have no idea how to solve this, maybe just avoid it.

5. Problem: Docker-Compose Nginx error: connect() failed(111: Connection refused) while connecting to upstream

   Solution: instead of `proxy_pass: localhost` use `proxy_pass: container_name` where container_name is the name of container in docker-compose.yml

6. Problem: Refreshing on routes other than root result in 404

   Solution: in server.js add `app.use((req, res) => res.sendFile(path.join(__dirname, '../build/index.html')))`

7. Problem: Not enough ram when building client.

   Solution: haven't found one... tried increasing max ram with `--max-old-space-size` but didn't work.

8. Problem: Webpack alias working on windows but gets unresolved error on linux

   Solution: tried to remove alias first but still showing the same error, cause of this is because the file is all lowercase but the import line has first letter uppercase, windows ignored case on filename but linux doesn't do that, changing the first letter of filename to uppercase fixed this issue.

9. Problem: Webpack error `Cannot use [chunkhash] or [contenthash] for chunk in '[name].[contenthash].js' (use [hash] instead)`

   Solution: comment out `new webpack.HotModuleReplacementPlugin()` in plugins
