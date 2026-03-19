"use strict";

// DOM 요소 선택 (id와 클래스를 더 구체적으로 지정)
const $input = document.querySelector("#todoInput");
const $todoContainer = document.querySelector("#todoList .items-container");
const $doneContainer = document.querySelector("#doneList .items-container");

if (!$input || !$todoContainer || !$doneContainer) {
    console.error("필수 DOM 요소를 찾을 수 없습니다.");
} else {
    // 초기 데이터 로드
    loadTodos();

    // 엔터키 이벤트 리스너
    $input.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const value = $input.value.trim();
            if (value === "") {
                alert("할 일을 입력해주세요!");
                return;
            }
            addTodo(value);
            $input.value = ""; // 입력창 초기화
        }
    });
}

// 아이템 생성 공통 함수
function createItem(text, buttonText, buttonCallback) {
    const $item = document.createElement("div");
    $item.classList.add("todo-item");

    const $textBox = document.createElement("span");
    $textBox.textContent = text;

    const $button = document.createElement("button");
    $button.textContent = buttonText;
    $button.addEventListener("click", buttonCallback);

    $item.appendChild($textBox);
    $item.appendChild($button);
    return $item;
}

// 할 일 추가
function addTodo(text) {
    const $item = createItem(text, "완료", () => completeTodo($item, text));
    $todoContainer.appendChild($item);
    saveTodos();
}

// 완료 처리
function completeTodo($item, text) {
    $item.remove(); // 기존 리스트에서 삭제
    
    // 완료 리스트용 아이템 새로 생성 (삭제 버튼 포함)
    const $doneItem = createItem(text, "삭제", () => deleteTodo($doneItem));
    $doneContainer.appendChild($doneItem);
    saveTodos();
}

// 삭제 처리
function deleteTodo($item) {
    $item.remove();
    saveTodos();
}

// 로컬 스토리지 저장
function saveTodos() {
    const todos = [];
    const doneTodos = [];

    $todoContainer.querySelectorAll(".todo-item span").forEach($span => {
        todos.push($span.textContent);
    });
    $doneContainer.querySelectorAll(".todo-item span").forEach($span => {
        doneTodos.push($span.textContent);
    });

    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("doneTodos", JSON.stringify(doneTodos));
}

// 데이터 불러오기
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem("todos") || "[]");
    const doneTodos = JSON.parse(localStorage.getItem("doneTodos") || "[]");

    todos.forEach(text => {
        const $item = createItem(text, "완료", () => completeTodo($item, text));
        $todoContainer.appendChild($item);
    });

    doneTodos.forEach(text => {
        const $item = createItem(text, "삭제", () => deleteTodo($item));
        $doneContainer.appendChild($item);
    });
}