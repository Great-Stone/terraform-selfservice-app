# Terraform : Self-service example

[![KR](https://img.shields.io/badge/Localization-KR-brightgreen?style=flat)](https://github.com/Great-Stone/terraform-selfservice-app/blob/master/README_KR.md)

This is an API-based self-service example that creates Cloud resources using Terraform.

![app and tfc](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Workspaces%20%20lguplus-selfservice%20%20Terraform%20Cloud%202020-12-06%2018-59-54-20201207202701851.png)


## Prerequisite

### config.ini

Change the contents of `apiserver/config.ini` to suit each setting
- organization : Terraform Cloud's organization name
- postfix : The name added after creating the workspace
- tf_token : User token to use API for Terraform Cloud
- oauth_token_id : Token ID of VCS linked to Organization

## Info.

### Terraform Workspace : gcp-module01
- Provision the following items
    - provider.tf : Configure Google Provider.
        - There is a branch statement that can read the `credentials_file` for local testing.
            `credentials = var.credentials == "" ? file(var.credentials_file) : var.credentials`
    - network.tf : vpc-network (Load existing vpc data)
    - compute.tf : create compute_instance
    - cloudsql.tf : create google sql database
    - cloudstoragebucket.tf : create google storage bucket
    - output.tf : Output result you want to use after provisioning

- Configure variables for repeated use.
    - variable.tf : When creating a workspace by changing the value of the variable, you can configure a repetitive workspace with the same template.

### Git Repo
- Put the resource provisioning template code on the Git Repo.
- Configure a new Terraform workspace using the template in the API server.
- You must have access to the Git Repo in Terraform Cloud.
    - Visiting Terraform Cloud
    - Selecting Organization
    - Click the upper `Settings`
    - Settings for Git Repo to be accessed from VCS Providers on the left

### API Server : apiserver

- An example application created in Nodejs.
    - The version used in the sample configuration is as follows:
        - node : v15.3.0
        - npm : 7.0.14
    - `express` was used.
    - Run `npm install` on app_example to get started.
- Configure credential json file for Google Cloud access.
    - ex : /app_example/credential.json
    - The credential is encrypted when the workspace is first created and saved as a variable.
- Directory description
    - public : Page and existing js configuration
    - routes : API route
        - list.js : Bring up the workspace list.
        - runs.js : There is a runs api for `terraform destroy`.
        - workspaces : There are APIs for creating workspaces, adding variables, and deleting workspaces.
    - template : This is the Request Body repository for the saved templates of Git Repo.
        - workspace.json : 
            - Care must be taken as auto-approve is activated as a value for creating a workspace.
            - **Need to change `repo link` to an appropriate link**
        - variables.json : List of variables for this template only
        - destory.json : Request to delete a resource in the workspace (the workspace will not be deleted)
- Terraform user token
    - `TFE_TOKEN` is declared as an environment variable in the routes header.
    - Create a token as follows and save it as an environment variable or test it by putting it in the code.
        - Click the user icon at the top right of Terraform Cloud
        - Click User settings
        - Click Tokens on the left to create a new token
- Execution is executed with `npm start` and the port is set to 3000.
    - http://localhost:3000

### API UI
- Workspace List
    - Call the list of created workspaces.
    - Each action is performed by the button composition of the workspace card in the list.
        - Workspace Info : Workspace Information Retrieval Sample
        - Output : Check the output data you want to check after provisioning Terraform
        - Destroy : Removes resources and performs the same operation as `terraform destory`
        - Delete : If the workspace is **deleted and it is deleted without being destoryed**, the corresponding resource exists.
- Create
    - Previously, the part received as a variable in the Terraform code was received as a UI and requested an API.


## Appendix
### Create a Workspace
> https://www.terraform.io/docs/cloud/api/workspaces.html#create-a-workspace

- endpoint : POST /organizations/:organization_name/workspaces
- sample :
```bash
$ curl \
  --header "Authorization: Bearer $TFE_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/organizations/gs-selfservice/workspaces
```

### Ceate a Variable
> https://www.terraform.io/docs/cloud/api/workspace-variables.html#create-a-variable

- endpoint : POST /workspaces/:workspace_id/vars
- sample :
```bash
curl \
  --header "Authorization: Bearer $TFE_TOKEN" \
  --header "Content-Type: application/vnd.api+json" \
  --request POST \
  --data @payload.json \
  https://app.terraform.io/api/v2/workspaces/ws-4j8p6jX1w33MiDC7/vars
```
