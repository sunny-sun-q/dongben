vpn:gzyongyou/1qaz1qaz

服务器：http://172.16.1.246:8080

登录：/wbalone/pages/login/login.html
主数据账号密码是：mdmadmin001/123qwe

100034 这个账号是 第一次提交发起流程的角色，
101512 这个账号是第一个审批人的账号，
100011 这个账号是第二次审批人的账号，主要用来驳回到第一个审批人的
/api/modeling/mdmshow/card/save?_R=0.9894710011856782

E:\sui\sb\gitee\mdm-front\mdm-front\src\pages\data-maintenance\maintenance\routes\index.js
E:\sui\sb\gitee\mdm-front\mdm-front\src\pages\data-management\management\routes\tree_card\tree_card_edit\index.js

E:\sui\sb\gitee\mdm-front\mdm-front\src\pages\data-maintenance\maintenance\routes\home_process\index.js
E:\sui\sb\gitee\mdm-front\mdm-front\src\pages\data-management\management\routes\tree_card\card\index.js

保存调用页面
E:\sui\sb\gitee\mdm-front\mdm-front\src\pages\data-maintenance\maintenance\stores\data-edit-store.js

rejectToBillMaker     驳回到制单人
withdraw  弃审
delegate  改派
signAdd   加签
rejectToActivity     驳回到制单人
agree    同意
unagree  不同意 

1、不能保存的问题试应为缺少mdm_code和pk_mdm值的传入导致

2、字表保存过程中已有数据的mdm_code和pk_mdm值也没有传入 导致每次都认为是新增项

3、字表增行操作时编辑态下的行，按下任意键行状态会变成非编辑态，如果字表有权限控制的情况下勾选行，会导致处于编辑状态不可逆转，需要刷新页面才能切换其他字表