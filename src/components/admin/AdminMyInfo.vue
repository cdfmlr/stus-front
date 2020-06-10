<template>
  <div>
    <a-card id="info-card" hoverable style="width: 300px">
      <img
              slot="cover"
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
      <!--      <template slot="actions" class="ant-card-actions">-->
      <!--        <a-icon key="setting" type="setting" />-->
      <!--        <a-icon key="edit" type="edit" />-->
      <!--        <a-icon key="ellipsis" type="ellipsis" />-->
      <!--      </template>-->
      <a-card-meta :title="uid" :description="utype">
        <a-avatar
                style="color: #f56a00; backgroundColor: #fde3cf"
                slot="avatar">
          {{ (uid && uid.length >= 1) ? uid[0] : 'A' }}
        </a-avatar>
      </a-card-meta>
    </a-card>
  </div>
</template>

<script>
    import {getCookie} from "../../util/cookieUtil";

    export default {
        name: "AdminMyInfo",
        data: function () {
            return {
                utype: getCookie("utype"),
                uid: getCookie("uid")
            }
        }
    }
</script>

<style scoped>
  #info-card {
    width: 300px;
    margin: 0 auto;
    text-align: start;
  }
</style>