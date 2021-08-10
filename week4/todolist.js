/*** Composition API ***/

import { 
    createApp, 
    computed, 
    onMounted, 
    ref 
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.0-beta.7/vue.esm-browser.min.js';

const app = {
    setup() {
        //定義資料
        //新的todo
        const newTodo = ref('');
        //將所有todo資料放到array
        const todoList = ref([]);
        //抓取的資料ID
        const tempId = ref('');
        //抓取的資料項目
        const tempItemName = ref('');
        //todolist的顯示狀態，預設顯示【全部】
        const visibility = ref('all');

        const filteredList = computed(() => {
            switch (visibility.value) {
                //未完成
                case 'uncompleted':
                    return todoList.value.filter((item) => !item.completed);
                //已完成
                case 'completed':
                    return todoList.value.filter((item) => item.completed);
                //全部    
                default:
                    return todoList.value;
            }
        });

        // 新增 todo
        const addTodo = () =>{
            const { value } = newTodo;
            // 新增的 todo 項目名稱不可空白
            if(!value.trim()){
                alert('新增的待辦事項名稱不可空白，請確認輸入!');
                return
            }
            // 將新的todo 項目新增到 todoList的陣列
            todoList.value.push({
                id: Date.now(),
                itemName: value,
                completed: false,  //todo項目的狀態
            });
            // 清空輸入【新增待辦事項】
            newTodo.value = '';
            // 更新local Storage 【歷史資料】
            record();
        };

        // 變換 todo 狀態
        const toggleTodo = (item) => {
            item.completed = !item.completed;  //true->false;  false->true
            // 更新local Storage 【歷史資料】
            record();
        };

        // 編輯的todo
        const editTodo = (item) => {
            tempId.value = item.id;
            tempItemName.value = item.itemName;
        };

        // 儲存編輯後的todo
        const updateEdit = (item) => {
            // 編輯的 todo 項目不可為空白
            if (!tempItemName.value.trim()) {
                alert('編輯的項目不可為空白，請重新確認輸入!');
                return;
            }
            // 取得當前編輯項目在todoList array中的index
            const arrIdx = todoList.value.findIndex((item) => item.id === tempId.value);
            // 將被編輯的資料項目替換成編輯後的資料
            todoList.value[arrIdx].itemName = tempItemName.value;
            // 清空抓取的資料
            tempId.value = '';
            tempItemName.value = '';
            // 更新local Storage 【歷史資料】
            record();
        };

        // 取消編輯
        const cancelEdit = () => {
            // 清空抓取的資料
            tempId.value = '';
            tempItemName.value = '';
        };

        // 刪除 todo
        const deleteTodo = (id) => {
            // 取得欲刪除項目在todoList array中的index
            const arrIdx = todoList.value.findIndex((item) => item.id === id);
            // 將項目從todoList中移除
            todoList.value.splice(arrIdx, 1);
            // 更新local Storage 【歷史資料】
            record();
        };

        //刪除全部項目資料
        const deleteAllTodo = () => {
            if (confirm('請確定要刪除全部項目?')) {
                //清空 todoList 
                todoList.value = [];
            }
            // 更新local Storage 【歷史資料】
            record();
        };

        // 將歷史記錄存入 LocalStorage
        const record = () => {
            // 將資料轉成字串型式
            const records = JSON.stringify(todoList.value);
            localStorage.setItem('todoList', records);
        }

        onMounted( () => {
            // 取得存在local Storage的資料
            let listData = localStorage.getItem('todoList');
            todoList.value = listData === null ? [] : JSON.parse(listData);
            // console.log(todoList.value);
        });

        return {
            newTodo,
            todoList,
            tempId,
            tempItemName,
            visibility,
            filteredList,

            addTodo,
            toggleTodo,
            editTodo,
            updateEdit,
            cancelEdit,
            deleteTodo,
            deleteAllTodo,
        }
    }
}

createApp(app).mount('#app');
