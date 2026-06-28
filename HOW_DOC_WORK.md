# How Documentation Work

[Our website](https://seatunnel.apache.org) is generated from this repository (**apache/seatunnel-website**),
but the current documentation content is sourced from [our codebase repository](https://github.com/apache/seatunnel/tree/dev/docs).
That means we have to fetch the docs from the codebase repository before we build the site.

In practice, the repository boundary is:

- Edit **current docs pages** in `apache/seatunnel` under `docs/en` and `docs/zh`.
- Edit the **website shell** in `apache/seatunnel-website`, including the homepage, navigation, version entry, search, styles, rendering, community pages, and historical version snapshots.

You could fetch the docs manually, but we provide a more convenient script: `tools/build-docs.sh`. It will:

* Create the directory named `swap` under your project directory, as well `docs` and `static/image_en`.
* Fetch the latest code in codebase repository(apache/seatunnel) to directory `swap`.
* Sync the latest `seatunnel/docs/en` and `seatunnel/docs/en/image` to directory `docs` and `static/image_en`.

When the main library code is synchronized locally, HTTP is used by default because it does not require a password or secret key.
If you already use SSH locally, run `export PROTOCOL_MODE=ssh` in your terminal to switch the fetch protocol.

After that, the site has the resources it needs and you can run the normal `npm` commands to build or preview it.

## How It Works in GitHub Action

Our GitHub Action also uses `tools/build-docs.sh` for the prepare step.
Using the same sync path in local development and CI keeps website maintenance predictable.
