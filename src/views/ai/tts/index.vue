<template>
	<el-card>
		<div class="databaseDivClass">
			<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
        <el-form-item>
				  <el-input v-model="state.queryForm.text" placeholder="语音内容"></el-input>
				</el-form-item>
        <el-form-item>
          <el-select v-model="state.queryForm.type" placeholder="语音类型">
            <el-option key="1" label="语音转文本" value="1"/>
            <el-option key="2" label="文本生成语音" value="2"/>
          </el-select>
        </el-form-item>
				<el-form-item>
					<el-button @click="getDataList()">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="danger" @click="deleteBatchHandle()">删除</el-button>
				</el-form-item>
			</el-form>
			<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" max-height="calc(100vh - 400px )" @selection-change="selectionChangeHandle">
				<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
				<el-table-column prop="text" label="语音文本" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="type" label="类型" header-align="center" align="center">
          <template #default="scope">
            <span>{{typeMapping[scope.row.type]}}</span>
          </template>
        </el-table-column>
				<el-table-column prop="ttsPath" label="存储路径" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fileUrl" label="访问地址mp3" header-align="center" align="center" show-overflow-tooltip>
          <template #default="scope">
            <audio ref="audioPlayer" controls>
              <source :src="scope.row.fileUrl" type="audio/wav">
            </audio>
          </template>

        </el-table-column>
        <el-table-column prop="fileUrl" label="访问地址mp4" header-align="center" align="center" show-overflow-tooltip>
          <template #default="scope">
            <video ref="videoPlayer" controls>
              <source :src="scope.row.fileUrl" type="video/mp4">
            </video>
          </template>
        </el-table-column>

        <el-table-column prop="size" label="文件大小" header-align="center" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" header-align="center" align="center" width="160" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
					<template #default="scope">
						<el-button type="danger" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				:current-page="state.page"
				:page-sizes="state.pageSizes"
				:page-size="state.limit"
				:total="state.total"
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="sizeChangeHandle"
				@current-change="currentChangeHandle"
			>
			</el-pagination>

		</div>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="Data-integrateDatabaseIndex">
import { useCrud } from '@/hooks'
import { reactive, ref, computed } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage } from 'element-plus/es'
import store from "@/store";

const state: IHooksOptions = reactive({
	dataListUrl: '/aidet/tts/page',
	deleteUrl: '/aidet/tts/delete',
	queryForm: {
    text: '',
    type: ''
	},
	drawer: false
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const typeMapping = ref({
  '1': '语音转文本',
  '2': '文本生成语音'
})

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>

<style>
	.databaseDivClass {
		height: calc(100vh - 170px );
		position: relative;
		overflow: hidden;
	}
	.databaseDivClass > .drawerClass > div {
		height: 100%;
		position: absolute !important;
		overflow: hidden;
	}

	.tableMain {
		display : flex;

	}
	.tableMain div:nth-child(1){
		flex : 1;
	}
	.tableMain div:nth-child(2){
		flex : 2;
	}
</style>
