# git 操作

# git revert

`git revert` 是一个**安全的撤销**方法，它不会删除历史记录，而是通过创建新提交来抵消之前的修改。

- 如何恢复被 revert 的文件？
 
  如果你后悔执行了 git revert，可以再次 revert 这个撤销操作：
  ```bash
    git revert HEAD  # 撤销上一次的 revert 操作
  ```