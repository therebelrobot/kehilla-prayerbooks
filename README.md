![TNGCP_banner](https://user-images.githubusercontent.com/679178/123176796-f6466e00-d438-11eb-82fe-ab8a07ec48d6.png)

Typescript + Next.js + GraphQL + Chakra UI + Prettier boilerplate.

_Note: I'm updating this to more modern versions in the next few days/weeks, so stay tuned_

### Todo's

- [ ] Update core libraries to latest
  - [x] Node @16
  - [x] React @17.0.2
  - [x] Next.js @11.0.1
  - [x] Apollo/Graphql
    - [x] apollo-server-micro @2.25.2
    - [x] @apollo/client @3.3.20
  - [x] Typescript @4.3.4
  - [x] Chakra UI
  - [x] Prettier @2.3.1
- [x] Build out README
- [ ] Explore Jest alternative (Cypress?)
- [ ] Build website
- [ ] Implement bootstrap CLI for NPM/npx

<!--- These are examples. See https://shields.io for others or to customize this set of shields. You might want to include dependencies, project status and licence info here --->

![GitHub repo size](https://img.shields.io/github/repo-size/therebelrobot/tngcp)
![GitHub contributors](https://img.shields.io/github/contributors/therebelrobot/tngcp)
![GitHub stars](https://img.shields.io/github/stars/therebelrobot/tngcp?style=social)
![GitHub forks](https://img.shields.io/github/forks/therebelrobot/tngcp?style=social)
![GitHub issues](https://img.shields.io/github/issues/therebelrobot/tngcp)
![GitHub license](https://img.shields.io/github/license/therebelrobot/tngcp)
![Twitter Follow](https://img.shields.io/twitter/follow/therebelrobot?style=social)

TNGCP is a production-ready application template that allows fullstack engineers to quickly bootstrap a new application with sane and secure defaults.

I mainly made this because I kept remaking it over and over, and wanted an easy way to copypasta that for future projects.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of Node (v16, ideally using NVM)
- You have a Mac or Linux machine. Windows might work, but I haven't tested it there.

## Starting out with TNGCP

### Copy the codebase

#### The fast way(s)

- Github Templates: Click the green "Use This Template" button on the main page of the repo, set the name of your new repo, and there you go
- [to come] `tngcp` cli: run the TNGCP cli tool. This is a work in progress, and more docs will be available in the future.

#### The slow way(s)

- Git clone this repo, change the remote url to your git repo, push the changes
- Download a zip file of this repo, place wherever you manage your websites

### Install dependencies

```sh
nvm install && nvm use # this will read .nvmrc to install/switch to Node 16
yarn install # node module dependencies
cp .env.example .env # ensure environment variables are set properly for development
```

### Run application

```sh
yarn start
# start reads the ENVIRONMENT env variable (from .env) to start production or development servers
```

and go to [localhost:9797](http://localhost:9797/) to see it started. A GraphQL playground is running on [localhost:9797/api/graphql](http://localhost:9797/api/graphql)

## Contributing to TNGCP

To contribute to TNGCP, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin TNGCP/<location>`
5. Create the pull request.

Alternatively see the GitHub documentation on [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## Contributors

Thanks to the following people who have contributed to this project:

<table>
  <tr>
    <td align="center"><a href="https://aster.hn">
      <img src="https://avatars.githubusercontent.com/u/679178?v=4?s=100" width="100px;" alt=""/><br />
      <sub><b>Aster Haven</b></sub></a><br />
      <a href="#question-therebelrobot" title="Answering Questions">💬</a>
      <a href="https://github.com/all-contributors/all-contributors/commits?author=therebelrobot" title="Code">💻</a>
      <a href="https://github.com/all-contributors/all-contributors/commits?author=therebelrobot" title="Documentation">📖</a>
      <a href="https://github.com/all-contributors/all-contributors/pulls?q=is%3Apr+reviewed-by%3Atherebelrobot" title="Reviewed Pull Requests">👀</a>
  </tr>
</table>

We use the [All Contributors](https://github.com/all-contributors/all-contributors) specification and its [emoji key](https://allcontributors.org/docs/en/emoji-key). All contributions to this project are welcome!

## Contact

If you want to contact me you can reach me at <github@aster.hn>.

## License

This project uses the following license: [MIT](https://tldrlegal.com/license/mit-license).
