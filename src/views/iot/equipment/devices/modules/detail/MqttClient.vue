<template>
  <div class="home-container">
    <el-card shadow="always" style="margin-bottom:30px;">
      <el-row>
        <el-col span="12">
          <el-button size="small" icon="el-icon-setting" v-if="!showConfigFlg" @click="handleShowConfig()" />
        </el-col>
        <el-col span="12">
          <el-button size="small" icon="el-icon-arrow-up" v-if="showConfigFlg" @click="handleShowConfig()" />
        </el-col>
        <el-col span="3" push="9">
          <el-button
            type="success"
            size="small"
            class="conn-btn"
            style="margin-right: 20px;"
            :disabled="client.connected"
            @click="createConnection"
            :loading="connecting"
            v-if="!client.connected"
          >
            {{ client.connected ? 'Connected' : 'Connect' }}
          </el-button>

          <el-button v-if="client.connected" type="danger" size="small" class="conn-btn" @click="destroyConnection"> Disconnect </el-button>
        </el-col>
      </el-row>

      <el-form ref="configForm" hide-required-asterisk size="small" label-position="top" :model="connection" v-if="showConfigFlg">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="host" label="Host">
              <el-row :gutter="10">
                <el-col :span="7">
                  <el-select v-model="connection.protocol" @change="handleProtocolChange">
                    <el-option label="ws://" value="ws" />
                    <el-option label="wss://" value="wss" />
                  </el-select>
                </el-col>
                <el-col :span="17">
                  <el-input v-model="connection.host" />
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="port" label="Port">
              <el-input v-model.number="connection.port" type="number" placeholder="8083/8084" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="endpoint" label="Mountpoint">
              <el-input v-model="connection.endpoint" placeholder="/mqtt" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="clientId" label="Client ID">
              <el-input v-model="connection.clientId" :placeholder="clientId" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="username" label="Username">
              <el-input v-model="connection.username" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="password" label="Password">
              <el-input v-model="connection.password" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always" style="margin-bottom:30px;">
      <el-row>
        <el-col :span="22">
          <div class="emq-title">Subscribe</div>
        </el-col>
        <el-col :span="2">
          <el-col span="12">
            <el-button size="small" icon="el-icon-arrow-down" v-if="!showSubFlg" @click="showSubFlg=!showSubFlg" />
          </el-col>
          <el-col span="12">
            <el-button size="small" icon="el-icon-arrow-up" v-if="showSubFlg" @click="showSubFlg=!showSubFlg" />
          </el-col>
        </el-col>
      </el-row>

      <el-table :data="subscriptionList" v-loading="$store.state.loading" style="width: 100%" v-if="showSubFlg">
        <el-table-column label="说明" width="120">
          <template #default="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.desc" placement="top-start">
              <el-input v-model="scope.row.desc" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="topic" width="250">
          <template #default="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.topic" placement="top-start">
              <el-input v-model="scope.row.topic" placeholder="topic" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="qos">
          <template #default="scope">
            <el-select v-model="scope.row.qos" placeholder="qos">
              <el-option label="0" value="0" />
              <el-option label="1" value="1" />
              <el-option label="2" value="2" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="140" fix="right">
          <template #default="scope">
            <el-row>
              <el-col :span="16">
                <el-button size="medium" v-if="!scope.row.sub" :disabled="!client.connected" @click="doSubscribe(scope.$index, scope.row)"
                  >订阅</el-button
                >

                <el-button size="medium" v-if="scope.row.sub" @click="doUnSubscribe(scope.$index, scope.row)">取消订阅</el-button>
              </el-col>

              <el-col :span="4">
                <el-button
                  type="danger"
                  :disabled="scope.row.sub"
                  size="small"
                  @click="handleDelete(scope.$index, scope.row)"
                  circle
                  icon="el-icon-minus"
                />
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="mt-4" style="width: 100%" @click="handleAdd" icon="el-icon-plus" v-if="showSubFlg" />
    </el-card>
    <el-card shadow="always" style="margin-bottom:30px;">
      <el-row>
        <el-col :span="22">
          <div class="emq-title">Publish</div>
        </el-col>
        <el-col :span="2">
          <el-col span="12">
            <el-button size="small" icon="el-icon-arrow-down" v-if="!showPubFlg" @click="showPubFlg=!showPubFlg" />
          </el-col>
          <el-col span="12">
            <el-button size="small" icon="el-icon-arrow-up" v-if="showPubFlg" @click="showPubFlg=!showPubFlg" />
          </el-col>
        </el-col>
      </el-row>
      <el-table :data="publishList" v-loading="$store.state.loading" style="width: 100%" v-if="showPubFlg">
        <el-table-column label="说明" width="120" fixed="left">
          <template #default="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.desc" placement="top-start">
              <el-input v-model="scope.row.desc" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="topic" width="150">
          <template #default="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.desc" placement="top-start">
              <el-input v-model="scope.row.topic" />
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="内容" width="350">
          <template #default="scope">
            <el-input v-model="scope.row.payload" type="textarea" />
          </template>
        </el-table-column>

        <el-table-column label="qos">
          <template #default="scope">
            <el-select v-model="scope.row.qos" placeholder="qos">
              <el-option label="0" value="0" />
              <el-option label="1" value="1" />
              <el-option label="2" value="2" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="140" fixed="right">
          <template #default="scope">
            <el-row>
              <el-col :span="16">
                <el-button size="medium" :disabled="!client.connected" @click="doPublish(scope.$index, scope.row)">发送</el-button>
              </el-col>

              <el-col :span="4">
                <el-button
                  type="danger"
                  :disabled="scope.row.sub"
                  size="small"
                  @click="handleDeletePublish(scope.$index, scope.row)"
                  circle
                  icon="el-icon-minus"
                />
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="mt-4" style="width: 100%" @click="handleAddPublish" icon="el-icon-plus" v-if="showPubFlg" />
    </el-card>
    <el-card shadow="always" style="margin-bottom:30px;">
      <div class="emq-title">Receive</div>
      <el-col :span="24">
        <el-input type="textarea" :rows="3" style="margin-bottom: 15px" v-model="receiveNews" readOnly />
      </el-col>
    </el-card>
  </div>
</template>

<script>
import mqtt from 'mqtt'

export default {
    name: 'MqttClient',
    props: {
        deviceDetail: {
            type: Object,
            default: () => { }
        }
    },
    watch: {
        deviceDetail: {
            handler() {
                this.connection.clientId = this.clientId
                this.connection.username = this.username
                this.connection.password = this.password
                this.sys2ServeTopicPrefix =
                    '/sys/' + this.productKey + '/' + this.deviceName + '/s'
                this.sys2ClientTopicPrefix =
                    '/sys/' + this.productKey + '/' + this.deviceName + '/c'
                    this.initTopicList()
            },
            deep: true
        },

    },

    computed: {
        clientId() {
            return this.deviceDetail.productKey + '_' + this.deviceDetail.deviceName + '_' + this.deviceDetail.model
        },
        username() {
            return 'simulator_' + this.deviceDetail.deviceName
        },
        password() {
            return this.deviceDetail.secret
        },
        productKey() {
            return this.deviceDetail.productKey
        },
        deviceName() {
            return this.deviceDetail.deviceName
        },


    },
    mounted() {



    },



    data() {
        return {
            showPubFlg: true,
            showSubFlg:true,
            showConfigFlg: true,
            sys2ServeTopicPrefix: '',
            sys2ClientTopicPrefix: '',
            connection: {
                protocol: 'ws',
                host: '127.0.0.1',
                // ws: 8083; wss: 8084
                port: 8083,
                endpoint: '/mqtt',
                // for more options, please refer to https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
                clean: true,
                connectTimeout: 30 * 1000, // ms
                reconnectPeriod: 4000, // ms
                clientId: '',
                // auth
                username: '',
                password: '',
            },

            subscriptionList: [],

            publishList: [],
            receiveNews: '',
            qosList: [0, 1, 2],
            client: {
                connected: false,
            },
            subscribeSuccess: false,
            connecting: false,
            retryTimes: 0,
        }
    },
    methods: {
        initData() {
            this.client = {
                connected: false,
            }
            this.retryTimes = 0
            this.connecting = false
            this.subscribeSuccess = false
            this.subscriptionList.forEach(element => {
                element.sub = false
            })
        },

        initTopicList() {
            this.publishList = [{
                topic: this.sys2ServeTopicPrefix + '/event/事件名',
                qos: 0,
                payload: '',
                desc: '事件上报',

            }, {
                topic: this.sys2ServeTopicPrefix + '/event/property/post',
                qos: 0,
                payload: '',
                desc: '属性上报'
            }, {
                topic: this.sys2ServeTopicPrefix + '/config/get',
                qos: 0,
                payload: '',
                desc: '设备获取配置'
            }
            ],
                this.subscriptionList = [
                    {
                        desc: '属性设置',
                        topic: this.sys2ClientTopicPrefix + '/service/property/set',
                        qos: 0,
                        sub: false,
                    },
                    {
                        desc: '属性获取',
                        topic: this.sys2ClientTopicPrefix + '/service/property/get',
                        qos: 0,
                        sub: false,
                    },
                    {
                        desc: '设备配置下发',
                        topic: this.sys2ClientTopicPrefix + '/config/set',
                        qos: 0,
                        sub: false,
                    },

                ]
        }
        ,
        handleShowConfig() {
            this.showConfigFlg = !this.showConfigFlg
        },
        handleOnReConnect() {
            this.retryTimes += 1
            if (this.retryTimes > 5) {
                try {
                    this.client.end()
                    this.initData()
                    this.$message.error('重连超时,停止重试')
                } catch (error) {
                    this.$message.error(error.toString())
                }
            }
        },
        createConnection() {
            try {
                this.connecting = true
                const { protocol, host, port, endpoint, ...options } = this.connection
                const connectUrl = `${protocol}://${host}:${port}${endpoint}`
                console.log(mqtt)
                this.client = mqtt.connect(connectUrl, options)
                if (this.client.on) {
                    this.client.on('connect', () => {
                        this.connecting = false
                        console.log('Connection succeeded!')
                    })
                    this.client.on('reconnect', this.handleOnReConnect)
                    this.client.on('error', error => {
                        console.log('Connection failed', error)
                    })
                    this.client.on('message', (topic, message) => {
                        this.receiveNews = this.receiveNews.concat(message)
                        console.log(`Received message ${message} from topic ${topic}`)
                    })
                }
            } catch (error) {
                this.connecting = false
                console.log('mqtt.connect error', error)
            }
        },
        // subscribe topic
        // https://github.com/mqttjs/MQTT.js#mqttclientsubscribetopictopic-arraytopic-object-options-callback
        doSubscribe(idx, element) {
            if (this.client.connected) {
                const { topic, qos } = element
                this.client.subscribe(topic, { qos }, (error, res) => {

                    if (error) {
                        console.log('Subscribe to topics error', topic, error)
                        element.sub = false
                        return
                    } else {
                        console.log('Subscribe to topics: ', topic, 'res', res)
                        element.sub = true
                    }

                })
                this.$message.info('订阅成功')
            } else {
                this.$message.error('请先连接')
            }

        },
        // unsubscribe topic
        // https://github.com/mqttjs/MQTT.js#mqttclientunsubscribetopictopic-array-options-callback
        doUnSubscribe(idx, element) {

            const { topic } = element
            this.client.unsubscribe(topic, error => {
                if (error) {
                    console.log('Unsubscribe error', error)
                    return
                }
                if (element.sub) {
                    element.sub = false
                }
            })


        },
        handleAdd() {
            this.subscriptionList.push({  desc: '属性设置',
                        topic: this.sys2ClientTopicPrefix ,
                        qos: 0,
                        sub: false })
        },
        handleDelete(index) {
            this.subscriptionList.splice(index, 1)
        },

        handleAddPublish() {
            this.publishList.push({ qos: 0 })
        },
        handleDeletePublish(index) {
            this.publishList.splice(index, 1)
        },

        // publish message
        // https://github.com/mqttjs/MQTT.js#mqttclientpublishtopic-message-options-callback
        doPublish(idx, item) {
            const { topic, qos, payload } = item
            this.client.publish(topic, payload, { qos }, error => {
                if (error) {
                    console.log('Publish error', error)
                    this.$message.error('发布失败')

                    return
                }
                this.$message.info('发布成功')
            })
        },
        // disconnect
        // https://github.com/mqttjs/MQTT.js#mqttclientendforce-options-callback
        destroyConnection() {
            if (this.client.connected) {
                try {
                    this.client.end(false, () => {
                        this.initData()
                        console.log('Successfully disconnected!')
                    })
                } catch (error) {
                    console.log('Disconnect failed', error.toString())
                }
            }
        },
        handleProtocolChange(value) {
            this.connection.port = value === 'wss' ? '8084' : '8083'
        },
    },
}
</script>
