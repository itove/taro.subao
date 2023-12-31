import  React, { useState, useEffect, useRef } from "react";
import { View } from '@tarojs/components'
import './index.scss'
import {
  Swipe,
  Cell,
  Form,
  Picker,
	Uploader,
  Button,
  InputNumber,
  Input,
  TextArea
} from '@nutui/nutui-react-taro'
import { Right, Uploader as Plus } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import { Env } from '../../env'

function Index() {
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState('')
  const [types, setTypes] = useState([])
  const [othersList, setOthersList] = useState([])
  const [count, setCount] = useState(0)
  const [desc1, setDesc1] = useState('')
  const [uid, setUid] = useState(0)
  const [form] = Form.useForm()
  const countRef = useRef()

  useEffect(() => {
    countRef.current = count
  }, [count])

  useEffect(() => {
    Taro.getStorage({
      key: Env.storageKey
    })
    .then(res => {
      setUid(res.data.id)
    })
    .catch(err => {
      console.log(err)
      Taro.redirectTo({url: '/pages/me/login'})
    })
  }, [])

  useEffect(() => {
    Taro.request({
      url: Env.apiUrl + 'types'
    })
    .then(res => {
      // console.log(res)
      let t = res.data
      for (const i of t) {
        i.text = i.name
        i.value = i.id
      }
      setTypes(t)
    })
  }, [])

  const changePicker = (list: any[], option: any, columnIndex: number) => {
    // console.log(columnIndex, option)
  }

  const confirmPicker = (options: PickerOption[], values: (string | number)[]) => {
    setType(options[0])
    setDesc1('')
  }

  const assembleData = (v) => {
    let data = {
      title: v.title,
      body: v.body,
      type: '/api/types/' + type.value,
      lawyer: '/api/users/' + uid
    }

    if (form.getFieldValue('files') !== undefined && form.getFieldValue('files')[0] !== undefined) {
      data.application = JSON.parse(form.getFieldValue('files')[0].responseText.data).url.replace(/.*\//, '') 
    }

    let o = []
    for (let i = 0; i < count; i++) {
      let nameText = 'other-text-' + i
      let namePic = 'other-pic-' + i
      let image
      if (form.getFieldValue(namePic) === undefined) {
        image = ''
      } else {
        image = JSON.parse(form.getFieldValue(namePic)[0].responseText.data).url.replace(/.*\//, '') 
      }
      o.push({
        name: form.getFieldValue(nameText),
        image 
      })
    }
    if (o.length > 0) {
      data.others = o
    }
    console.log(data)
    return data
  }

  const onFinishFailed = v => {
    if (type.value === undefined) {
      setDesc1('请选择类型')
    }
    
    assembleData(v)
  }

  const formSubmit = v => {
    if (type.value === undefined) {
      setDesc1('请选择类型')
      return
    }
    let data = assembleData(v)
    // return

    Taro.request({
      method: 'POST',
      url: Env.apiUrl + 'nodes',
      data
    }).then((res) => {
      if (res.statusCode === 201) {
        Taro.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        }).then(() => {
          Taro.reLaunch({ url: '/pages/node/index' })
        })
      } else {
        Taro.showToast({
          title: '系统错误',
          icon: 'error',
          duration: 2000
        })
        console.log('server error！' + res.errMsg)
      }
    })
  }
  
  const onFailure = (res) => {
    console.log(res)
  }

  const onSuccess = (res) => {
    console.log(res)
  }

  const onSuccessOther = (res) => {
    console.log(res)
  }

  const rmOne = () => {
    genList(countRef.current - 1)
  }

  const genList = (c) => {
    let swipeDisabled = true
    let l = []
    for (let i = 0; i < c; i++) {
      if (i === c-1) { swipeDisabled = false }
      l.push(
      <>
        <Form.Item
          name={"other-text-" + i}
          label="材料名称"
          errorMessageAlign="right"
          className="tips-block"
          rules={[
            { required: true, message: '请输入材料名称' },
          ]}
        >
          <Input
            className="nut-input-text"
            placeholder="请输入材料名称"
            type="text"
            align="right"
          />
        </Form.Item>

        <Swipe
          onActionClick={() => rmOne()}
          disabled={swipeDisabled}
          rightAction={
           <Button type="primary" shape="square">
             删除
           </Button>
          }
        >
        <Form.Item
          name={"other-pic-" + i}
        >
          <Uploader
            name="upload"
            xhrState={201}
            maxCount="1" multiple="true"
            data={{type: 3}}
            url={Env.uploadUrl}
            onSuccess={onSuccessOther}
            onFailure={onFailure}
          />
        </Form.Item>
        </Swipe>
      </>
      )
    }
    setOthersList(l)
    setCount(c)
  }

  const reset = () => {
    console.log('reset')
    setOthersList([])
    // setType({})
    setCount(0)
  }

  return (
    <View className="">
      <View className="index">
      <Form
        form={form}
        className="form"
        divider
        labelPosition="left"
        onFinish={(values) => formSubmit(values)}
        onFinishFailed={(values) => onFinishFailed(values)}
        footer={
          <View className="footer">
            <Button formType="submit" type="primary"> 提交 </Button>
            <Button formType="reset" type="default" onClick={reset}> 清空 </Button>
          </View>
        }
      >
        <Cell title="请选择类型" description={desc1} className="red-desc" extra={type.name} onClick={() => setVisible(!visible)} />
        <Picker
          visible={visible}
          options={types}
          onConfirm={(list, values) => confirmPicker(list, values)}
          onClose={() => setVisible(false)}
          onChange={changePicker}
         />

        <Form.Item
          className="tips-block"
          label="标题"
          name="title"
          errorMessageAlign="right"
          rules={[
            { max: 25, message: '标题不能超过25个字' },
            { required: true, message: '请输入标题' },
          ]}
        >
          <Input
            className="nut-input-text"
            placeholder="请输入标题"
            align="right"
            type="text"
          />
        </Form.Item>

        <Cell>正文</Cell>
        <Form.Item
          name="body"
					autoSize="true"
          rules={[
            { min: 10, message: '正文不能少于10个字' },
            { required: true, message: '请输入正文' },
          ]}
        >
          <TextArea placeholder="请输入正文" maxLength={1000} />
        </Form.Item>

         <Form.Item
            label="申请书图片"
            name="files"
         >
          <Uploader
            name="upload"
            xhrState={201}
            // maxCount="9" multiple="true"
            data={{type: 2}}
            url={Env.uploadUrl}
            onSuccess={onSuccess}
            onFailure={onFailure}
          />
        </Form.Item>

        {othersList}

        <View class="btn-wrapper">
          <Button size="small" block type="default" onClick={() => {genList(count + 1)}} icon={<Plus size="16" />}> 添加材料 </Button>
        </View>

      </Form>
      </View>
    </View>
  )
}

export default Index
