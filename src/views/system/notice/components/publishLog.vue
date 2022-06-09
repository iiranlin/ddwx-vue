<template>
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="openDataScope" width="600px" append-to-body>
        <el-table ref="elTable" class="container_table" v-loading="loading" height="300px" :data="noticeLogList" @selection-change="handleSelectionChange" @sort-change="sortableColumnChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="通知标题" prop="noticeTitle" sortable="custom" align="center" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="通知内容" prop="noticeMessage" sortable="custom" align="center" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="状态" align="center" sortable="custom" width="100">
        <template slot-scope="{row}">
          {{row.flag === 0? '未发布' : '已发布'}}
        </template>
      </el-table-column> -->
      <el-table-column label="创建时间" sortable="custom" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="修改时间" sortable="custom" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <!-- <template slot-scope="scope"> -->
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
          >删除</el-button>
           <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="publish">发布</el-dropdown-item>
              <el-dropdown-item command="publishLog">发布日志</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-user"
            @click="bindMenu(scope.row)"
            v-hasPermi="['system:role:remove']"
          >分配菜单</el-button> -->
          <!-- <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:role:edit']">
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleUser" icon="el-icon-circle-check">分配用户</el-dropdown-item>
              <el-dropdown-item command="handleMenu" icon="el-icon-user">分配菜单</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        <!-- </template> -->
      </el-table-column>
    </el-table>
    <pagination 
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
    </el-dialog>
</template>
<script>
import {noticeLog}  from '@/api/system/notice';
import indexMixin from '@/views/mixins';
export default {
  mixins: [indexMixin],
  data() {
    return {
      loading: false,
      title: '发布日志',
      id: '',
      openDataScope: false,
      noticeLogList:[],
      total:0
    }
  },
  created(){
    //   getList
    },
  methods:{
      open(row){
        this.openDataScope = true;
        this.getList(row)   
      },
      getList(row){
          this.loading = true;
          noticeLog(row.id,this.listQuery).then(({data})=>{
            this.noticeLogList = data.list;
            this.total = data.total;
            this.$nextTick(() => {
                this.$refs.elTable.doLayout()
            })
            this.loading = false;
          })
      },
      handleSelectionChange(){

      },
      sortableColumnChange(){

      }
    }
  }
  </script>