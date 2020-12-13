# Terraform : Self-service example

[![EN](https://img.shields.io/badge/Localization-EN-brightgreen?style=flat)](https://github.com/Great-Stone/terraform-selfservice-app)

Terraform 을 활용하여 GCP 리소스를 생성하는 API 기반 Self-Service예제 입니다.

![app and tfc](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Workspaces%20%20lguplus-selfservice%20%20Terraform%20Cloud%202020-12-06%2018-59-54-20201207202701851.png)


## 준비사항

### config.ini

`apiserver/config.ini`의 내용을 각 설정에 맞게 변경합니다.
- organization : Terraform Cloud의 organization 이름
- postfix : Workspace생성시 뒤에 추가되는 이름
- tf_token : Terraform Cloud에 API를 사용하기 위한 사용자 토큰
- oauth_token_id : Organization에 연동되어있는 VCS의 토큰 아이디


## 구성정보

### Terraform Workspace

- 다음의 항목을 프로비저닝 합니다.
    - provider.tf : Google 프로바이더를 구성합니다.
        - 로컬 테스트를 위해 credentials_file을 읽어올 수 있는 분기문이 있습니다.
            `credentials = var.credentials == "" ? file(var.credentials_file) : var.credentials`
    - network.tf : vpc-network (기존에 생성된 vpc 데이터를 불러옴)
    - compute.tf : compute_instance 생성
    - cloudsql.tf : google sql database 생성
    - cloudstoragebucket.tf : google storage bucket 생성
    - output.tf : 프로비저닝 이후 사용하고자하는 출력결과

- 반복적 사용을 위해 변수들을 구성합니다.
    - variable.tf : 워크스페이스 구성시 해당 변수 값을 변경하여 생성하면, 동일한 템플릿으로 반복적인 워크스페이스를 구성할 수 있습니다.

### Git Repo
- 리소스 프로비저닝 템플릿 코드를 Git Repo에 올려놓습니다.
- API용 서버에서 해당 템플릿을 이용하여 새로운 Terraform 워크스페이스를 구성합니다.
- Terraform Cloud에서 Git Repo에 대한 접근권한이 있어야 합니다.
    - Terraform Cloud 접속
    - Organization 선택
    - 상단 Settings
    - 왼쪽 VCS Providers에서 접근할 Git Repo에 대한 설정

### API Server

- Nodejs로 생성된 예제 애플리케이션입니다.
    - 샘플 구성에 사용된 버전은 다음과 같습니다.
        - node : v15.3.0
        - npm : 7.0.14
    - express가 사용되었습니다.
    - 시작을 위해 app_example 에서 `npm install`을 실행해 주세요.
- Google Cloud 접근을 위한 credential json파일을 구성합니다.
    - ex : /app_example/credential.json
    - 해당 credential을 최초 워크스페이스 생성시 암호화하여 변수로 저장합니다.
- 디렉토리 설명
    - public : 페이지와 기존 js 구성
    - routes : API route 구성
        - list.js : 워크스페이스 리스트를 불러옵니다.
        - runs.js : destory를 위한 runs api가 있습니다.
        - workspaces : 워크스페이스를 생성, 변수 추가, 워크스페이스 삭제를 위한 api가 있습니다.
    - template : Git Repo의 저장된 템플릿을 위한 Request Body 저장소 입니다.
        - workspace.json :
            - 워크스페이스를 생성하기위한 값으로 auto-approve가 활성화되어있으므로 주의가 필요
            - **`repo link`를 알맞은 링크로 변경 필요**
        - variables.json : 해당 템플릿만을 위한 변수 리스트
        - destory.json : 워크스페이스의 리소스를 삭제하는 요청 (워크스페이스가 삭제되지는 않음)
- Terraform 사용자 토큰
    - routes의 header에 TFE_TOKEN 이 환경변수로 선언되어있습니다.
    - 다음과 같이 Token을 생성하고 환경변수로 저장하거나 코드상에 넣어서 테스트 합니다.
        - Terraform Cloud 우측 상단의 사용자 아이콘을 클릭
        - User settings 클릭
        - 좌측 Tokens 클릭하여 새로운 토큰을 생성
- 실행은 `npm start`로 실행하며 포트는 3000번으로 설정되어있습니다.
    - http://localhost:3000

### API UI
- Workspace List
    - 생성되어있는 워크스페이스 리스트를 호출합니다.
    - 리스트의 워크스페이스 카드의 버튼 구성으로 각 동작을 수행합니다.
        - Workspace Info : 워크스페이스 정보 불러오기 샘플
        - Output : 테라폼 프로비저닝 이후 확인하고자 하는 Output 데이터 확인
        - Destroy : 리소스를 제거하며, `terraform destory`와 동일한 동작을 수행
        - Delete : 워크스페이스를 삭제 되며 **destory되지 않은 상태로 delete되면 해당리소스가 존재하므로 주의**
- Create
    - 앞서 Terraform 코드에서 변수로 받는 부분을 UI로 받아서 API를 호출


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
