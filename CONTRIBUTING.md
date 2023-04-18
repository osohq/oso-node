# Contributing to Oso

## Responsible disclosure

If you believe you have discovered a security vulnerability in Oso, please send
details of the issue to security@osohq.com. Please do not open a GitHub issue
or otherwise comment about the issue in a public forum.

## Need help getting started?

If you're struggling to get set up with Oso or have questions about usage,
check out [the documentation][docs] or [join us on Slack][slack] to ask
questions.

[docs]: https://www.osohq.com/docs
[slack]: https://join-slack.osohq.com

## Reporting issues

If you would like to report a bug, please first ensure that the bug has not
already been reported by searching [the project's open issues on
GitHub][issues].

If you can't find an existing issue, please [open a new one][new-issue]. Be
sure to include as much detail as possible, including a reproducible code
sample.

[issues]: https://github.com/osohq/oso-node/issues
[new-issue]: https://github.com/osohq/oso-node/issues/new

## Contributing code

If you would like to contribute to this project, please open a pull request
with your changes. If you haven't already read and signed our [Contributor
License Agreement][cla], you will be asked to do so upon opening your first PR.
Thank you for contributing!

[cla]: https://github.com/osohq/cla/blob/main/individual.md

## Publishing a Release

_These steps are only relevant to Oso employees when preparing and publishing a new SDK release._

1. Create a new branch off of `main`. Push the branch to remote.
2. Run `yarn lerna version --no-private`. This pushes versioning commits and release package to remote.
3. Create a PR towards the `main` branch.
4. After the PR is merged, publish the release using the [publish workflow](https://github.com/osohq/oso-node/actions/workflows/publish.yml).
