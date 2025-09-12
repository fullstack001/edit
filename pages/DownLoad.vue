<template>
  <div>
    <div v-show="downloading">
      <Processing
        :progress="'Downloading'"
        :text="'Do not close your browser. Requested file is being downloaded. This may take a few moments.'"
      />
    </div>
    <div class="download-page" v-show="!downloading">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
      />
      <div class="page-title">
        <div class="md-badge">
          <i class="fa-solid fa-check"></i>
        </div>
        {{ button_title ? button_title : "Successfully Processing" }}
      </div>
      <div class="page-description" style="margin-bottom: 20px">
        {{ down_name ? down_name : "File name" }}
      </div>
      <div class="download_btn">
        <div
          id="link"
          class="download__btn md-raised md-danger"
          @click="downloadFile"
        >
          Download

          <i
            class="fa fa-download"
            style="margin-left: 10px"
            aria-hidden="true"
          ></i>
        </div>

        <div class="continue">
          <div>
            <md-dialog-confirm
              :md-active.sync="active"
              md-title="File Availability Timer"
              :md-content="`<div><div>This file will be deleted after two hours. </div>
                <div class='timer'>
                  <div class='timer-item'><div class='timer-count'> ${
                    hours != null ? hours : ''
                  } </div> <div class='timer-label'>Hours</div></div>
                  <div class='timer-item'><div class='timer-count'>${
                    minutes != null ? minutes : ''
                  }</div> <div class='timer-label'>Minutes</div></div>
                  <div class='timer-item'><div class='timer-count'>${
                    seconds != null ? seconds : ''
                  }</div> <div class='timer-label'>Seconds</div></div>
                </div>
              </div>`"
              md-confirm-text="DELETE IT NOW"
              md-cancel-text="Cancel"
              @md-confirm="onConfirm"
            />

            <md-button class="md-icon-button share-btn" @click="calc_del_time">
              <i
                class="fa fa-trash"
                aria-hidden="true"
                style="font-size: 16px !important"
              ></i>
              <md-tooltip md-direction="top">DELETE IT NOW</md-tooltip>
            </md-button>
            <GDriveSelector
              :buttonStyle="'upload'"
              :file="{
                fileUrl: `https://api.pdfden.com/api${this.downloadURL}`,
                name: down_name,
              }"
              style="margin-right: 10px"
            />
            <VueDropboxPicker
              class="cloud dropbox"
              link-type="direct"
              :multiselect="true"
              :position="'addMore'"
              :extensions="['.pdf', '.doc']"
              :folderselect="false"
              :uploadFiles="[id]"
              :buttonType="'saver'"
            />
            <md-button
              class="md-icon-button download-more share-btn"
              @click="showDialog = true"
            >
              <!-- <md-icon>link</md-icon> -->
              <i
                class="fa fa-link"
                aria-hidden="true"
                style="font-size: 16px !important"
              ></i>
              <md-tooltip md-direction="bottom"
                >Share file link or QRcode</md-tooltip
              >
            </md-button>
          </div>
          <div></div>
        </div>

      </div>

      <md-dialog-alert
        :md-active.sync="show_noti"
        md-content="PDF file  has been deleted!"
        md-confirm-text="Cool!"
      />

      <div>
        <md-dialog :md-active.sync="showDialog">
          <md-dialog-title>Copy & Send download link</md-dialog-title>
          <md-dialog-content>
            <div
              class="form__group form__group--btn form__group--btn-lg copy-items"
            >
              <div class="input--icon input--world">
                <input
                  id="dlink"
                  type="text"
                  class="input"
                  :value="download_urls"
                  onclick="this.select();"
                  readonly="true"
                  ref="linkInput"
                />
              </div>
              <button class="btn" id="autoCopy" @click="copyLink">
                <svg
                  aria-hidden="true"
                  width="12"
                  height="12"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="currentColor"
                    d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"
                    class=""
                  ></path>
                </svg>
                Copy
              </button>
            </div>
            <div class="dialog_description">
              Instantly download to your phone
            </div>
            <!-- <qr-code :text="download_urls" :size="250" error-level="H"></qr-code> -->
            <qrcode-vue :value="download_urls" :size="300" level="H" />
          </md-dialog-content>

          <md-dialog-actions>
            <md-button
              class="md-raised"
              @click="showDialog = false"
              style="background-color: #0000ff !important"
              >Close</md-button
            >
          </md-dialog-actions>
        </md-dialog>
      </div>
      <div class="chart_area">
        <Chart
          :resultSize="Number(reSize)"
          :originSize="Number(originSize)"
          v-if="before == 'compresspdf'"
        />
      </div>
      <SetRate />
    </div>
  </div>
</template>
<script>
//   import Vue from "vue";
//  import CryptoJS from "crypto-js";
import VueDropboxPicker from "@/components/DropboxPicker.vue";

import Chart from "@/components/Chart.vue"; // Replace with the correct path
import GDriveSelector from "@/components/GDriveSelector.vue";
import SetRate from "@/components/SetRate.vue";
import QrcodeVue from "qrcode.vue";
import Processing from "@/components/Processing.vue";
export default {
  head() {
    return {
      title:
        "Free Online PDF Tools – PDFden.com",
    };
  },
  components: {
    VueDropboxPicker,
    GDriveSelector,
    Chart,
    QrcodeVue,
    SetRate,
    Processing,
  },
  props: {
    message: String,
    icon: String,
    verticalAlign: {
      type: String,
      default: "top",
    },
    horizontalAlign: {
      type: String,
      default: "center",
    },
    type: {
      type: String,
      default: "info",
    },
    timeout: {
      type: Number,
      default: 1200,
    },
    timestamp: {
      type: Date,
      default: () => new Date(),
    },
  },
  data: () => ({
    uploadToDropboxFiles: [],
    active: false,
    show_noti: false,
    showDialog: false,
    download_urls: "",
    id: "",
    button_title: "",
    dis_text: "",
    down_name: "",
    gDriveFile: "",
    file_type: "",
    downloadURL: "",
    before: "",
    url: null,
    files: [],
    originSize: 1,
    reSize: 0,
    hours: null,
    minutes: null,
    seconds: null,
    go_deleted_page: false,
    downloading: false,
  }),
  computed: {
    result() {
      return store.state.result;
    },
  },
  created() {},
  mounted() {
    this.download_urls = window.location.origin + this.$route.fullPath;
    // // Your secret key (should be kept private)
    const secretKey = "mySecretKey123";

    // // Decrypt the encrypted message using the same secret key

    const decrypted = this.$crypto.AES.decrypt(
      this.$route.query.param,
      secretKey
    ).toString(this.$crypto.enc.Utf8);

    const paramObj = JSON.parse(decrypted);
    console.log(paramObj);
    this.id = paramObj.id;
    this.button_title = paramObj.button_title;
    this.dis_text = paramObj.dis_text;
    this.down_name = paramObj.down_name;
    this.file_type = paramObj.file_type;
    this.originSize = paramObj.originSize;
    this.reSize = paramObj.resultSize;
    this.before = paramObj.before;
    this.downloadURL = `/pdf/download/${this.id}`;
    this.checkFile();
  },
  methods: {
    checkFile() {
      this.$axios
        .post("/pdf/get_from_db", { name: this.id })
        .then((res) => {
          if (Object.keys(res.data).length > 0) {
            this.saveClient();
          } else {
            this.$router.push({
              path: "/deleted",
            });
          }
        })
        .catch((err) => {
          this.$router.push({
            path: "/deleted",
          });
        });
    },
    async downloadFile() {
      this.downloading = true;
      try {
        const response = await fetch(
          `https://api.pdfden.com/api${this.downloadURL}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const blob = await response.blob();

        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        // Create an anchor element and trigger the download
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = this.down_name; // Set the desired filename here
        document.body.appendChild(a);
        a.click();
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.downloading = false;
      } catch (error) {
        console.error("Download error:", error);
        this.downloading = false;
      }
    },

    async calc_del_time() {
      await this.$axios
        .get(`/pdf/time/${this.id}`)
        .then((res) => {
          const twoHoursAfter = Date.parse(res.data) + 2 * 3600 * 1000;
          setInterval(() => {
            const remainigTime = Math.floor(
              (twoHoursAfter - Date.now()) / 1000
            );
            this.hours = Math.floor(remainigTime / (60 * 60));
            this.minutes = Math.floor((remainigTime % (60 * 60)) / 60);
            this.seconds = remainigTime % 60;
          }, 1000);
          this.active = true;
        })
        .catch((err) => {
          this.$router.push({
            path: "/deleted",
          });
          console.log(err);
        });
    },
    async onConfirm() {
      await this.$axios
        .get(`/pdf/delete/${this.id}`)
        .then((res) => {
          this.$router.push({
            path: "deleted",
          });
          this.go_deleted_page = true;
        })
        .catch((err) => console.log(err));
    },
    copyLink() {
      // Select the text in the input field
      const inputField = this.$refs.linkInput;
      inputField.select();

      try {
        console.log("Clecked COPY btn")
        // Attempt to copy the selected text to the clipboard
        document.execCommand("copy");
        alert("Link copied to clipboard!");
      } catch (err) {
        // If unable to copy, handle the error
        alert("Failed to copy link to clipboard");
      }
    },

    async saveClient() {
      let ipAddress = await fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => {
          return data.ip.split(" ")[0];
        });

      // Get user's browser information
      let browserName = "";
      const userAgent = navigator.userAgent;
      if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Mozilla Firefox";
      } else if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Google Chrome";
      } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Safari";
      } else if (
        userAgent.indexOf("MSIE") > -1 ||
        userAgent.indexOf("Trident/") > -1
      ) {
        browserName = "Internet Explorer";
      } else {
        browserName = "Unknown";
      }
      const userDownUrl = window.location.href;
      const locale = this.$route.params.locale;
      const userWorkUrl = locale
        ? `https://pdfden.com/${locale}/${this.before}`
        : `https://pdfden.com/${this.before}`;
      const client = {
        ip: ipAddress,
        browser: browserName,
        downUrl: userDownUrl,
        workUrl: userWorkUrl,
        file: this.id,
      };
      this.$axios
        .post("/admin/client", client)
        .then((res) => {})
        .catch((err) => {});
    },
  },
};
</script>
<style scope>
body {
  font-family: "Montserrat", sans-serif !important;
}
.copy-items {
  display: flex !important;
  justify-content: space-between !important;
}
#autoCopy {
  padding-right: 10px !important;
}
.timer {
  display: inline-flex;
  text-align: center;
}

.timer-item {
  margin: 20px 40px;
}

.timer-count {
  font-size: 22px;
  margin-bottom: 20px;
}

.timer-label {
  font-size: 16px;
  font-weight: 500;
}
</style>

<style scoped>
.continue div .md-icon-button {
  display: block;

  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 5px;
  margin-right: 5px;
  border: solid 2px #0000ff;
}

.share-btn {
  padding: 0 !important;
  background-color: #fefefe !important;
}
.share-btn:hover {
  background-color: #0000ff !important;
}
.share-btn:hover i {
  color: #fefefe !important;
}
.download-page {
  text-align: center;
}

.download__btn {
  cursor: pointer;
  display: inline-flex;

  align-items: center;

  justify-content: center;
  min-height: 80px;
  min-width: 330px;

  padding: 24px 48px;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  background: #0000ff;
  vertical-align: middle;
  color: #fff !important;
  text-decoration: none;
  margin-bottom: 12px;

  border: 0;
  border-radius: 12px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.14);
  -ms-flex-order: 1;
  order: 1;
  max-width: 60vw;
  width: auto;
}

.download__btn:hover {
  color: #fff !important;
  background: #0000ff;
}
.download__btn:focus {
  color: #fff !important;
  background: #0000ff;
}

.download_btn {
  color: #fff !important;
  position: relative;
  width: fit-content;
  margin: auto;
  width: auto;
}

.continue {
  width: fit-content;
  /* position: absolute; */
  top: -5px;
  right: -110px;
  margin: auto;
}

.continue div {
  display: flex;
}

.dropbox-icon {
  height: 40px;
  background-color: #fefefe;
}
.dropbox {
  margin-top: 0px;
}
.md-dialog .md-dialog-container {
  max-width: 768px;
}

.page-title {
  position: relative;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  font-weight: 700;
  font-size: 37px;
  line-height: 52px;
  color: #33333b;
  text-align: center;
  margin: auto;
  margin-top: 60px;
  margin-bottom: 20px;
  min-height: 37px;
}

.page-description {
  max-width: 800px;
  margin: 8px auto 0;
  line-height: 32px;
  font-size: 22px;
  font-weight: 400;
  color: #47474f;
}

.md-dialog-container {
  padding: 30px;
  border-radius: 5px;
  text-align: center;
}

.form__group {
  display: flex;
  margin-bottom: 10px;
}

#dlink {
  padding: 5px;
  margin: 0 20px;
}

.dialog_description {
  font-size: 18x;
  font-weight: 500;
  text-align: center;
  margin: 20px 0px;
}
.downloader__extra__btn {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  justify-content: center;
  color: #fff;
  -webkit-transition: all 0.1s linear;
  -o-transition: all 0.1s linear;
  transition: all 0.1s linear;
  cursor: pointer;
  background: #0000ff;
  margin: 6px 6px 8px;
  pointer-events: none;
}

.back-btn {
  background-color: #47474f;
  padding: 10px;
  cursor: pointer;
}

.extra-work {
  color: #575757;
  margin-top: 30px;
}

.extra-work .title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 15px;
}

.extra-work-area {
  display: inline-flex;
  margin: auto;
}

.download-more {
  margin-left: 10px;
  margin-right: 10px;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 20px;
}

.download-more img {
  width: 30px;
}

.chart_area {
  text-align: center;
}

.page-title span {
  color: #8ac823;
  padding-top: 8px;
  font-size: 35px;
}

.rate-secttion {
  padding: 50px 0;
  text-align: center;
}

.description-title {
  font-size: 24px;
  font-weight: 600;
}

.rate-star {
  padding: 20px 0;
}

.rate-star span {
  color: #0000ff;
}

.rate-score {
  color: #0000ff;
  font-size: 18px;
}

.rate-star span {
  cursor: pointer;
}

.rate-votes {
  font-size: 18px;
}
.md-badge {
  left: -56px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 5px;
  font-size: 29px;
  font-weight: bold;
  width: 43px;
  height: 42px;
  border-radius: 50%;
  color: #fff;
  pointer-events: none;
  background: #8ac823 !important;
}
@media (max-width: 991px) {
  .page-title {
    font-size: 26px;
  }
  .download-more-title {
    font-size: 17px;
  }
}
@media (max-width: 640px) {
  .page-title {
    font-size: 26px !important;
  }
  .md-badge {
    font-size: 22px;
    font-weight: bold;
    width: 34px;
    height: 33px;
    top: 10px;
    left: -38px;
  }
  .download-more {
    margin-left: 3px;
    margin-right: 3px;
  }
  .page-title {
    font-size: 20px !important;
  }
}
</style>
