Component({
  data: {},
  properties: {
    tabs: {
      type: Array,
      value: [],
    },
  },
  methods: {
    //点击事件
    handleItemTap: function (e) {
      //获取点击的索引
      const { index } = e.currentTarget.dataset
      this.triggerEvent('ItemChange', { index })
    },
  },
})
