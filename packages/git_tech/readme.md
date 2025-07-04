# git 操作

# git revert

`git revert` 是一个**安全的撤销**方法，它不会删除历史记录，而是通过创建新提交来抵消之前的修改。

- 如何恢复被 revert 的文件？
 
  如果你后悔执行了 git revert，可以再次 revert 这个撤销操作：
  ```bash
    git revert HEAD  # 撤销上一次的 revert 操作
  ```

# git reset [last good SHA]

默认情况下，git reset不改变工作区的文件（但会改变暂存区），--hard参数可以让工作区里面的文件也回到以前的状态。


# git commit --amend -m "Fixes bug #42"

提交以后，发现提交信息写错了，这时可以使用git commit命令的--amend参数，可以修改上一次的提交信息