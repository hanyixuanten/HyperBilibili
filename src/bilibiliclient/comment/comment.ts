import { decodeHtmlEntities } from "../../htmlparser";

export const BilibiliClientCommentMethods = {
    // 获取评论区内容
    async getReplies(this: any, type: string, oid: string, pn: number = 1, ps: number = 10, sort: number = 1) {
        const url = `https://api.bilibili.com/x/v2/reply?type=${type}&oid=${oid}&pn=${pn}&ps=${ps}&sort=${sort}`;
        const response = await this.getRequest(url);
        return decodeReplyMessages(response.data.data);
    },

    // 获取二级评论区内容
    async getSecReplies(this: any, type: string, oid: string, root: string, pn: number = 1, ps: number = 10) {
        const url = `https://api.bilibili.com/x/v2/reply/reply?type=${type}&oid=${oid}&pn=${pn}&ps=${ps}&root=${root}`;
        const response = await this.getRequest(url);
        return decodeReplyMessages(response.data.data);
    },

    // 点赞评论
    async LikeReply(this: any, type: string, oid: string, rpid: string, action: number) {
        const url = "https://api.bilibili.com/x/v2/reply/action";
        const body = `type=${type}&oid=${oid}&rpid=${rpid}&action=${action}&csrf=${this.biliJct}`;
        const response = await this.postRequest(url, body, "application/x-www-form-urlencoded");
        return response.data;
    },

    // 发送评论
    async GiveReply(this: any, type: string, oid: string, message: string) {
        const url = "https://api.bilibili.com/x/v2/reply/add";
        const body = `type=${type}&oid=${oid}&message=${message}&plat=1&csrf=${this.biliJct}`;
        const response = await this.postRequest(url, body, "application/x-www-form-urlencoded");
        return response.data;
    },

    // 回复评论（发送二级评论）
    async GiveSecReply(this: any, type: string, oid: string, parent: string, message: string) {
        const url = "https://api.bilibili.com/x/v2/reply/add";
        const body = `type=${type}&oid=${oid}&parent=${parent}&message=${message}&plat=1&csrf=${this.biliJct}`;
        const response = await this.postRequest(url, body, "application/x-www-form-urlencoded");
        return response.data;
    },

    // 回复二级评论（对话树）
    async GiveTreeReply(this: any, type: string, oid: string, parent: string, root: string, message: string) {
        const url = "https://api.bilibili.com/x/v2/reply/add";
        const body = `type=${type}&oid=${oid}&parent=${parent}&root=${root}&message=${message}&plat=1&csrf=${this.biliJct}`;
        const response = await this.postRequest(url, body, "application/x-www-form-urlencoded");
        return response.data;
    },
};

/**
 * 评论内容中的引号、大小于号等字符会以 HTML 实体形式返回（例如 &quot;、&lt;、&gt;）。
 * 在进入 UI 前统一解码，避免 QuickApp 的 text 组件把实体直接显示成乱码。
 */
function decodeReplyMessages(replyData: any): any {
    if (!replyData || !Array.isArray(replyData.replies)) {
        return replyData;
    }

    replyData.replies.forEach((reply: any) => {
        if (reply && reply.content && typeof reply.content.message === "string") {
            reply.content.message = decodeHtmlEntities(reply.content.message);
        }
    });

    return replyData;
}
