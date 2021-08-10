Vue.createApp({
    // 資料
    data() {
        return {
            //新的todo
            newTodo: '',
            //將所有todo資料放到array
            todoList: [],
            //抓取的資料ID
            tempId: '',
            //抓取的資料項目
            tempItemName: '',
            //todolist的顯示狀態，預設顯示【全部】
            visibility: 'all',
        }
    },
    // 刷新頁面，不修改原資料
    computed: {
        filteredList() {
            switch (this.visibility) {
                //未完成
                case 'uncompleted':
                    return this.todoList.filter((item) => !item.completed);
                //已完成
                case 'completed':
                    return this.todoList.filter((item) => item.completed);
                //全部    
                default:
                    return this.todoList;
            }
        },
    },
    //方法集
    methods: {
        // 新增 todo
        addTodo() {
            // 新增的 todo 項目名稱不可空白
            if(!this.newTodo.trim()){
                alert('新增的待辦事項名稱不可空白，請確認輸入!');
                return
            }
            // 將新的todo 項目新增到 todoList的陣列
            this.todoList.push({
                id: Date.now(),
                itemName: this.newTodo,
                completed: false,  //todo項目的狀態
            });
            // 清空輸入【新增待辦事項】
            this.newTodo = '';
            // 更新local Storage 【歷史資料】
            this.record();
        },
        // 變換 todo 狀態
        toggleTodo(item) {
            item.completed = !item.completed;  //true->false;  false->true
            // 更新local Storage 【歷史資料】
            this.record();
        },
        // 編輯的todo
        editTodo(item) {
            this.tempId = item.id;
            this.tempItemName = item.itemName;
        },
        // 儲存編輯後的todo
        updateEdit(item) {
            // 編輯的 todo 項目不可為空白
            if (!this.tempItemName.trim()) {
                alert('編輯的項目不可為空白，請重新確認輸入!');
                return;
            }
            // 取得當前編輯項目在todoList array中的index
            const arrIdx = this.todoList.findIndex((item) => item.id === this.tempId);
            // 將被編輯的資料項目替換成編輯後的資料
            this.todoList[arrIdx].itemName = this.tempItemName;
            // 清空抓取的資料
            this.tempId = '';
            this.tempItemName = '';
            // 更新local Storage 【歷史資料】
            this.record();
        },
        // 取消編輯
        cancelEdit() {
            // 清空抓取的資料
            this.tempId = '';
            this.tempItemName = '';
        },
        // 刪除 todo
        deleteTodo(id) {
            // 取得欲刪除項目在todoList array中的index
            const arrIdx = this.todoList.findIndex((item) => item.id === id);
            // 將項目從todoList中移除
            this.todoList.splice(arrIdx, 1);
            // 更新local Storage 【歷史資料】
            this.record();
        },
        //刪除全部項目資料
        deleteAllTodo() {
            if (confirm('請確定要刪除全部項目?')) {
                //清空 todoList 
                this.todoList = [];
            }
            // 更新local Storage 【歷史資料】
            this.record();
        },
        // 將歷史記錄存入 LocalStorage
        record() {
            // 將資料轉成字串型式
            const records = JSON.stringify(this.todoList);
            localStorage.setItem('todoList', records);
        }
    },
    // 初始化
    mounted() {
        // 取得存在local Storage的資料
        let listData = localStorage.getItem('todoList');
        this.todoList = listData === null ? [] : JSON.parse(listData);
        // console.log(this.todoList);
    },
}).mount('#app');