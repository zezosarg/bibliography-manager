<h1> Bibliography manager </h1> 

<br>

<p>
  Some of the technologies used:
  <a href="https://electron.atom.io/">Electron</a>, 
  <a href="https://facebook.github.io/react/">React</a>, 
  <a href="https://github.com/reactjs/react-router">React Router</a>, 
  <a href="https://webpack.js.org/">Webpack</a> 
   and <a href="https://www.npmjs.com/package/react-refresh">React Fast Refresh</a>.
</p>

## Requirements
Node.js version 20.10.0 and npm version 10.2.3

## Download and install requirements
Execute:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs=20.10.0-1nodesource1
sudo npm install -g npm@10.2.3
```

Or check:  <a href="https://nodejs.org/en/download">Download Node.js®</a>

## Install dependencies
After cloning or downloading the repo, install dependencies by executing:

```bash
cd your-project-name
npm install
```

## Starting Development
Start the app in the `dev` environment:

```bash
npm start
```

## Packaging for Production
To package apps for the local platform:

```bash
npm run package
```

## License
MIT ©
 