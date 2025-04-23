<template>
  <u-popup :show="show" mode="center" :mask="true" :show-close="true" @close="closeDialog">
    <view class="popup-content">
      <view class="input-title">请输入申请理由：</view>
      <u-input v-model="inputValue" placeholder="写点你的加入意愿吧~" type="textarea" height="120" />
      <view class="input-actions">
        <button class="dialog-btn cancel" @click="cancel">取消</button>
        <button class="dialog-btn confirm" @click="submitJoin">提交</button>
      </view>
    </view>
  </u-popup>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { applyToJoin } from '../api/api';

const props = defineProps({
  show: Boolean, // 控制弹窗显示
  teamId: String, // 从父组件接收 teamId
});

const emit = defineEmits(['update:show']); // 用于触发父组件的 update:show 事件

const inputValue = ref(''); // 申请理由的输入值

// 关闭弹窗并触发 update:show
const closeDialog = () => {
  emit('update:show', false);  // 设置 show 为 false 来关闭弹窗
};

// 取消按钮
const cancel = () => {
  closeDialog();
};

// 提交申请
const submitJoin = async () => {
  try {
    const teamId = props.teamId; // 使用接收到的 teamId
    const reason = inputValue.value?.trim(); // 使用 inputValue 作为加入理由
    if (!teamId) {
      uni.showToast({ title: '团队信息丢失，请稍后再试', icon: 'none' });
      return;
    }
    if (!reason) {
      uni.showToast({ title: '请输入加入理由', icon: 'none' });
      return;
    }

    uni.showLoading({ title: '提交中...' }); // 显示加载提示

    await applyToJoin(teamId, reason); // 提交申请
    uni.showToast({ title: '申请成功，等待审核', icon: 'success' });
    closeDialog(); // 提交成功后关闭弹窗
  } catch (error) {
    console.error('申请失败', error);
    uni.showToast({ title: '申请失败，请稍后重试', icon: 'none' });
  } finally {
    uni.hideLoading(); // 隐藏加载提示
  }
};
</script>




<style scoped lang="scss">
.popup-content {
  padding: 30rpx;
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.1);
}

.input-title {
  font-size: 28rpx;
  margin-bottom: 15rpx;
  color: #333;
}

.input-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20rpx;

  .dialog-btn {
    padding: 14rpx 40rpx;
    font-size: 28rpx;
    border-radius: 12rpx;
  }

  .cancel {
    background-color: #ccc;
    color: white;
  }

  .confirm {
    background-color: #007aff;
    color: white;
  }
}
</style>
