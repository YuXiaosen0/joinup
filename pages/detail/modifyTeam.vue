<template>
  <view class="popup-content">
    <view class="input-title">队伍名称：</view>
    <u-input
      v-model="teamInfo.name"
      placeholder="请输入队伍名称"
      border
      customStyle="margin-bottom: 20rpx;"
    />

    <view class="input-title">队伍描述：</view>
    <u-input
      v-model="teamInfo.description"
      placeholder="请输入队伍描述"
      type="textarea"
      height="140"
      border
      customStyle="margin-bottom: 20rpx;"
    />

    <view class="input-title">
      最大成员数：
      <text class="member-hint">（当前成员数：{{ currentMembers }}）</text>
    </view>
    <u-input
      v-model="teamInfo.maxMembers"
      placeholder="请输入最大成员数"
      type="number"
      border
      customStyle="margin-bottom: 20rpx;"
    />

    <view class="input-title">是否公开：</view>
    <view class="switch-wrapper">
      <u-switch v-model="teamInfo.open" activeColor="#2979ff" />
    </view>

    <view class="input-actions">
      <button class="dialog-btn cancel" @click="cancel">取消</button>
      <button class="dialog-btn confirm" @click="handleSubmit">提交</button>
    </view>
  </view>
</template>

<script>
import { modifyTeam } from '../../api/api';

export default {
  data() {
    return {
      teamId: null,
      currentMembers: 0,
      teamInfo: {
        name: '',
        description: '',
        open: true, // 默认公开
        maxMembers: 0,
      },
    };
  },
  onLoad(options) {
    this.teamId = Number(options.teamId);
    this.currentMembers = Number(options.currentMembers || 0);
    this.teamInfo.maxMembers = this.currentMembers;
	if (options.name) {
	    this.teamInfo.name = decodeURIComponent(options.name);
	  }
	  if (options.description) {
	    this.teamInfo.description = decodeURIComponent(options.description);
	  }
  },
  methods: {
    cancel() {
      uni.navigateBack();
    },
    async handleSubmit() {
      if (this.teamInfo.maxMembers < this.currentMembers) {
        uni.showToast({
          title: `最大成员数不能小于当前成员数（${this.currentMembers}）`,
          icon: 'none',
        });
        return;
      }

      try {
        const response = await modifyTeam(
          this.teamId,
          this.teamInfo.name,
          this.teamInfo.description,
          this.teamInfo.open,
          this.teamInfo.maxMembers
        );
        uni.showToast({ title: '修改成功', icon: 'success' });
        uni.navigateBack();
      } catch (error) {
        uni.showToast({ title: '修改失败', icon: 'none' });
      }
    },
  },
};
</script>

<style>
.popup-content {
  padding: 40rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.input-title {
  font-size: 30rpx;
  margin-bottom: 10rpx;
  font-weight: 600;
  color: #333;
}

.member-hint {
  font-weight: normal;
  font-size: 26rpx;
  color: #999;
}

.switch-wrapper {
  margin-bottom: 30rpx;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 50rpx;
}

.dialog-btn {
  flex: 1;
  margin: 0 10rpx;
  padding: 20rpx 0;
  border-radius: 16rpx;
  font-size: 30rpx;
  font-weight: bold;
  box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s;
}

.cancel {
  background-color: #f2f2f2;
  color: #666;
}

.confirm {
  background: linear-gradient(90deg, #3a8dff, #2979ff);
  color: #fff;
}
</style>
