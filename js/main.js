// ★STEP2
// https://jp.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}



new Vue({
  el: '#app',
  data: {
    todos: [],

    // 使用するデータ
    options: [
      { value:-1 , label: 'すべて'},
      { value: 0, label: '作業中'},
      { value: 1, label: '完了'},
    ],
    current: -1,
  },
  computed: {
    computedTodos: function() {
      // データがcurrentが-1ならすべて
      // それ以外ならcurrentとstateが一致するものだ一致するものだけに絞り込む
      return this.todos.filter(function(el) {
        return this.current < 0 ? true: this.current === el.state
      }, this)
    },
    labels() {
      return this.options.reduce(function(a,b){
        return Object.assign(a, {[b.value]: b.label})
      }, {})
    }
  },
  methods: {
    // 使用するメソッド
    doAdd: function(event , value) {
      // refで付けておいた要素を参照
      var comment = this.$refs.comment;
      // 入力がなければ何もしないでreturn
      if (!comment.value.length) {
        return;
      }
      this.todos.push({
        id: todoStorage.uid++,
        comment: comment.value,
        state: 0
      });
      comment.value = "";
    },
    // ステータスチェンジ
    doChangeState: function(item) {
      item.state = item.state ? 0 : 1;
    },
    // 削除の処理
    doRemove: function(item) {
      var index = this.todos.indexOf(item);
      this.todos.splice(index, 1);
    }
  },
  watch: {
    // オプションを使う場合はオブジェクト形式にする
    todos: {
      // 引数はウォッチしているプロパティの変更後の値
      handler: function(todos) {
        todoStorage.save(todos);
      },
      // deepオプションでネストしているデータも
      deep: true
    }
  },
  created() {
    // インスタンス作成時に自動的に fetch()する
    this.todos = todoStorage.fetch();
  },
});
