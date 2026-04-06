# continuous mode 사용법 (📌필독!)


https://github.com/cjo4m06/mcp-shrimp-task-manager

plan으로 생성된 모든 task를 수동 개입 없이 순차적으로 실행하는 방식

```
tasks.json (PENDING 태스크 목록)
[T001][T002][T003][T004]...
              ↓
   continuous mode 실행
              ↓
  execute → 구현 → verify
  execute → 구현 → verify
  execute → 구현 → verify  ← end-task 지정 시 여기서 중단 가능
              ↓
  모든 태스크 완료 (또는 end-task 도달 시 중단)
```

## When to Use

| 상황 | 방식 |
|------|------|
| 참고자료 / subagent / 추가 제약사항 모두 없음 | **continuous mode** ✅ |
| 참고자료 / subagent / 추가 제약사항이 있더라도 모든 태스크에 동일하게 적용 | **continuous mode** ✅ |
| 태스크마다 참고자료가 다름 | **execute_task 개별 실행** |
| 태스크 유형에 따라 subagent가 다름 | **execute_task 개별 실행** |
| 태스크별로 추가 제약사항이 다름 | **execute_task 개별 실행** |

continuous mode는 일괄 처리가 가능한 경우에만 사용.
태스크별 커스텀 처리가 필요하다면 execute_task 개별 실행 → @/docs/shrimp_tutorial/execute-task.md 참조


## continuous mode 실제 동작 과정

list_tasks → execute_task → 구현 → verify_task → 반복

① list_tasks 호출 → PENDING 상태 태스크 목록 확인
② 의존성 순서에 따라 첫 번째 실행 가능한 태스크 선택
③ execute_task(taskId) 호출 → 태스크 컨텍스트 프롬프트 수신
④ 프롬프트 기반 구현 수행 (또는 subagent 위임)
⑤ verify_task 호출 → COMPLETED 처리
⑥ 남은 PENDING 태스크 있으면 ②로 반복 (end-task 지정 시 해당 태스크 완료 후 중단)
⑦ 모든 태스크 COMPLETED (또는 end-task 도달) → 종료

핵심은 ⑥입니다. continuous mode는 별도 tool이 아닙니다.

Claude가 ②~⑥을 스스로 반복하는 워크플로우 패턴이며, 수동 개입 없이 지정 범위의 태스크를 완료까지 처리합니다.


## 올바른 전체 흐름


  ① list_tasks 호출
     → PENDING 상태 태스크 목록 수신

  ② execute_task 호출
     → "태스크 설명, 구현 가이드, 관련 파일, 검증 기준..." 프롬프트 수신

  ③ Claude가 수신한 프롬프트 기반으로 구현
     → (여기서 nextjs-app-developer Agent 호출)

  ④ verify_task 호출
     → 완료 처리 후 ②로 복귀, 남은 PENDING 태스크 반복

  즉 continuous mode는 "모든 태스크를 끝날 때까지 알아서 처리해줘" 하는 패턴이고,
  각 태스크의 실제 구현은 그 때마다 Claude의 몫입니다.


## 명령 best practice

```
모든 태스크를 continuous mode로 실행해줘:

1. mcp__shrimp-task-manager__list_tasks
   - PENDING 상태 태스크 목록 확인

2. 각 태스크를 의존성 순서대로 반복 실행:
   a. mcp__shrimp-task-manager__execute_task
      - taskId 조회 후 실행
      - 반환된 프롬프트(태스크 설명, 구현 가이드, 관련 파일, 검증 기준) 확인
      - 참고 자료 (optional): [구현에 필요한 추가 문서/데이터 경로]
   b. 반환된 프롬프트 기반으로 직접 구현
      - (optional)[추가 제약사항]
   c. mcp__shrimp-task-manager__verify_task
      - 구현 완료 후 해당 태스크 완료 처리

3. 모든 PENDING 태스크 완료될 때까지 반복
```

##### 특정 태스크부터 시작하는 경우 (끝까지 실행)
```
Task XXX부터 continuous mode로 실행해줘:

1. mcp__shrimp-task-manager__execute_task
   - tasks.json:: Task XXX: [태스크명]부터 시작
   - taskId 조회 후 실행
   - 반환된 프롬프트(태스크 설명, 구현 가이드, 관련 파일, 검증 기준) 확인
   - 참고 자료 (optional): [구현에 필요한 추가 문서/데이터 경로]

2. 반환된 프롬프트 기반으로 직접 구현
   - (optional)[추가 제약사항]

3. mcp__shrimp-task-manager__verify_task
   - 완료 처리 후 다음 PENDING 태스크로 계속 진행
```

##### 특정 범위 지정 (start → end)
```
Task XXX부터 Task YYY까지 continuous mode로 실행해줘:

1. mcp__shrimp-task-manager__execute_task
   - tasks.json:: Task XXX: [시작 태스크명]부터 시작
   - taskId 조회 후 실행
   - 반환된 프롬프트(태스크 설명, 구현 가이드, 관련 파일, 검증 기준) 확인
   - 참고 자료 (optional): [구현에 필요한 추가 문서/데이터 경로]

2. 반환된 프롬프트 기반으로 직접 구현
   - (optional)[추가 제약사항]

3. mcp__shrimp-task-manager__verify_task
   - 완료 처리 후 Task YYY: [종료 태스크명]까지 반복 진행
   - Task YYY: [종료 태스크명] 완료 후 중단 (이후 태스크는 실행하지 않음)
```

## subagent 활용

  > 주의: 구현 복잡도가 높은 태스크가 섞여있을 경우 모든 태스크에 동일 subagent를 지정하면 부적절할 수 있음.
  > 태스크 유형에 따라 subagent를 달리 지정하거나 Claude 직접 구현 혼용 권장.
```
모든 태스크를 continuous mode로 실행해줘 ({subagent명} subagent 활용):

1. mcp__shrimp-task-manager__list_tasks
   - PENDING 상태 태스크 목록 확인

2. 각 태스크를 의존성 순서대로 반복 실행:
   a. mcp__shrimp-task-manager__execute_task
      - taskId 조회 후 실행
      - 반환된 프롬프트(태스크 설명, 구현 가이드, 관련 파일, 검증 기준) 확인
      - 참고 자료 (optional): [구현에 필요한 추가 문서/데이터 경로]
   b. {subagent명} subagent에 구현 위임
      - call subagent: @{subagent md 파일 절대 경로}
        예) @/home/hgjun/workspace/claude-lab/_snippet/.claude/agents/dev/nextjs-app-developer.md
      - Step a에서 반환된 프롬프트 내용을 그대로 전달
      - (optional)[추가 제약사항]
        예) 추가 제약사항: 모든 소스 코드는 src/ 디렉토리 하위에 생성할 것
   c. mcp__shrimp-task-manager__verify_task
      - 완료 처리

3. 모든 PENDING 태스크 완료될 때까지 반복
```
