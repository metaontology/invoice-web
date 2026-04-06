# plan task 사용법 (📌필독!)


https://github.com/cjo4m06/mcp-shrimp-task-manager

프로젝트 ➝ ROADMAP ➝ 이걸 shrimp로 세부 task로 더 나눌때 사용
```
전체 프로젝트
[                                      ]
                   ↓
           ROADMAP 으로 나눔
           
[   ]  [   ]  [   ]  [   ]  [   ]  [   ]
         ↓
shrimp task manager
         ↓
  [ ] [ ] [ ] [ ]  더 작은 세부 task로 나눔!
```

## plan_task 실제 동작 과정

- 입력: `description, requirements, [existingTasksReference]`
- 반환: Claude가 따라야 할 계획 수립 지시 프롬프트
- 그 후 Claude가 분석 → split_tasks로 tasks.json에 저장

💡 입력 기준
```
공식 문서 기준: description, [requirements], [existingTasksReference] 이지만
PRD, ROADMAP 준비하고 사용하는경우 description, requirements, [existingTasksReference] 적극 권장
```

##  올바른 전체 흐름


  ① plan_task 호출
  → "코드베이스 분석 후 태스크를 이렇게 설계하라..." 계획 수립 지시 프롬프트 수신

  ② Claude가 수신한 프롬프트 기반으로 태스크 설계
  → 코드베이스 탐색, ROADMAP 분석, 각 태스크 명세(설명/구현가이드/관련파일/검증기준) 작성

  ③ split_tasks 호출
  → 설계한 태스크 목록을 tasks.json에 저장

  즉 plan_task는 "이 요구사항을 어떻게 태스크로 쪼개야 하는지 지시서를 줘" 하는 툴이고, 실제 설계와 저장은 그 다음
  Claude의 몫입니다.


## 명령 best practice

```
mcp__shrimp-task-manager__plan_task 를 다음 절차대로 수행해줘:

1. mcp__shrimp-task-manager__plan_task
 - description: Phase 1: 애플리케이션 골격 구축
 - requirements: @/home/hgjun/workspace/claude-lab/invoice-web/docs/ROADMAP.md
 - existingTasksReference: false

2. 반환된 프롬프트 기반으로 태스크 분석 및 설계
 - 코드베이스 탐색 후 각 태스크 명세 작성
 - (optional)[추가 제약사항]

3. mcp__shrimp-task-manager__split_tasks
 - 설계한 태스크 목록을 tasks.json에 저장
```

##### 새 Phase의 신규 plan 수행 + 기존 TASK 의존성 있는 경우
```
mcp__shrimp-task-manager__plan_task 를 다음 절차대로 수행해줘:

1. mcp__shrimp-task-manager__plan_task
 - description: Phase 1: 애플리케이션 골격 구축
 - requirements: @/home/hgjun/workspace/claude-lab/invoice-web/docs/ROADMAP.md
 - existingTasksReference: true
 - (의존성 있을 시) 의존성 TASK 참조: TASK 001, TASK 002, ...
  
2. 반환된 프롬프트 기반으로 태스크 분석 및 설계
 - 코드베이스 탐색 후 각 태스크 명세 작성
 - (optional)[추가 제약사항]

3. mcp__shrimp-task-manager__split_tasks
 - 설계한 태스크 목록을 tasks.json에 저장
```

##### 다시 plan 수행) 한 번 수행 후 다시 plan 하는 경우

> 추가/확장/재계획 시 `이전 plan 개선` 요청 명시
```
mcp__shrimp-task-manager__plan_task 를 다음 절차대로 수행해줘:

1. mcp__shrimp-task-manager__plan_task
 - description: Phase 1: 애플리케이션 골격 구축
 - requirements: @/home/hgjun/workspace/claude-lab/invoice-web/docs/ROADMAP.md
 - existingTasksReference: true
 - 이전 plan 개선해줘
 - [(의존성 있을 시) 의존성 TASK 참조: TASK 001, TASK 002, ...]
  
2. 반환된 프롬프트 기반으로 태스크 분석 및 설계
 - 코드베이스 탐색 후 각 태스크 명세 작성
 - (optional)[추가 제약사항]

3. mcp__shrimp-task-manager__split_tasks
 - 설계한 태스크 목록을 tasks.json에 저장
```

## subagent 활용

  > 주의: 코드베이스 탐색이 핵심인 경우 Claude 직접 수행이 효율적.
  > 특정 도메인 전문 지식이 필요한 설계에만 제한적으로 사용할 것.
```
mcp__shrimp-task-manager__plan_task 를 다음 절차대로 수행해줘:

  1. mcp__shrimp-task-manager__plan_task
     - description: Phase 1: 애플리케이션 골격 구축
     - requirements: @/home/hgjun/workspace/claude-lab/invoice-web/docs/ROADMAP.md
     - existingTasksReference: false

  2. [subagent명] subagent에 태스크 설계 위임
     - call subagent: @/path/to/subagent.md
     - Step 1에서 반환된 프롬프트 내용을 그대로 전달
     - (optional)[추가 제약사항]

  3. mcp__shrimp-task-manager__split_tasks
     - 설계한 태스크 목록을 tasks.json에 저장
```


