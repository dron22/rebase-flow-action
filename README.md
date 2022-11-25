# rebase-flow-action

Github action for beautiful commit history :heart:

![beautiful commit history example](images/beautiful-history.png?raw=true "Beautiful commit history")

## Usage

```yaml
on:
  push:
    branches-ignore:
      - 'master'

jobs:
  ensure-rebase-flow:
    name: Run rebase-flow-action
    runs-on: ubuntu-latest
    steps:
      - name: "Checkout"
        uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: "Ensure rebase flow for beautiful commit history"
        uses: dron22/rebase-flow-action@v0.1.0
        with:
          target-branch: 'develop' # optionally specify a target branch (default: main)
```
