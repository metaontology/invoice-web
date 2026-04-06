# execute task 사용법 (📌필독!)


https://github.com/cjo4m06/mcp-shrimp-task-manager

plan으로 작성된 task.json을 하나씩 실행하는 역할

## execute_task 실제 동작 과정
 

execute_task(taskId) 호출
① tasks.json에서 해당 taskId 태스크 존재 확인
② 의존 태스크 완료 여부 검증 (canExecuteTask)
③ 이미 IN_PROGRESS / COMPLETED 상태인지 확인
④ 상태를 IN_PROGRESS로 변경 (tasks.json 업데이트)
⑤ 관련 파일 내용 로드 (loadTaskRelatedFiles)
⑥ 복잡도 평가 (assessTaskComplexity)
⑦ 프롬프트 생성 후 텍스트로 반환 ← 핵심

핵심은 ⑦입니다. execute_task는 구현을 하지 않습니다.

태스크 컨텍스트가 담긴 프롬프트를 Claude에게 반환하고, Claude가 그 프롬프트를 읽고 구현을 수행합니다.


##  올바른 전체 흐름


  ① execute_task 호출
     → "태스크 설명, 구현 가이드, 관련 파일, 검증 기준..." 프롬프트 수신

  ② Claude가 수신한 프롬프트 기반으로 구현
     → (여기서 nextjs-app-developer Agent 호출)

  ③ verify_task 호출
     → 완료 처리

  즉 execute_task는 "이 태스크 어떻게 해야 하는지 상세 지시서를 줘" 하는 툴이고, 실제 구현은 그 다음 Claude의 몫입니다.


## 명령 best practice

```
mcp__shrimp-task-manager__execute_task 를 다음 절차대로 수행해줘:

1. mcp__shrimp-task-manager__execute_task
- tasks.json:: Task XXX: [태스크명]
- taskId 조회 후 실행
- 반환된 프롬프트(태스크 설명, 구현 가이드, 관련 파일, 검증 기준)를 확인
- 참고 자료 (optional): [구현에 필요한 추가 문서/데이터 경로]

2. 반환된 프롬프트 기반으로 직접 구현
- (optional)[추가 제약사항]

3. mcp__shrimp-task-manager__verify_task
- 구현 완료 후 Task XXX 완료 처리
```

## subagent 활용


```
mcp__shrimp-task-manager__execute_task 를 다음 절차대로 수행해줘:

1. mcp__shrimp-task-manager__execute_task
- tasks.json:: Task 002: 라우팅 구조 및 페이지 골격 생성
- taskId 조회 후 실행
- 반환된 프롬프트(태스크 설명, 구현 가이드, 관련 파일, 검증 기준)를 확인
- 참고 자료 (optional): [구현에 필요한 추가 문서/데이터 경로]

2. {subagent명} subagent에 구현 위임
- call subagent: @{subagent md 파일 절대 경로}
  예) @/home/hgjun/workspace/claude-lab/_snippet/.claude/agents/dev/nextjs-app-developer.md
- Step 1에서 반환된 프롬프트 내용을 그대로 전달
- (optional)[추가 제약사항]
  예) 추가 제약사항: 모든 소스 코드는 src/ 디렉토리 하위에 생성할 것

3. mcp__shrimp-task-manager__verify_task
- 구현 완료 후 Task 002 완료 처리
```