<template>
  <div>
    <Processing :progress="'Editing'" v-if="page_load == 'processing'" />
    <Uploading
      :progress="progress"
      :number="1"
      :total="1"
      :size="size"
      :file_name="'pdfden_edited.pdf'"
      v-if="page_load == 'uploading'"
    />
    <div
      class="main"
      :style="
        file
          ? 'display: flex;justify-content:flex-end'
          : 'display: inline-block; width: 100%;'
      "
      v-if="page_load == 'default'"
    >
      <input
        hidden
        type="file"
        name="file"
        id="fileInput"
        class="hidden-input"
        @change="onChange"
        ref="file"
        accept=".pdf"
      />
      <SelectFileComponent
        v-if="!file && page_load == 'default'"
        @open_add_local="open_add_local"
        @onPickedDropbox="onPickedDropbox"
        @onPickedGoogleDriver="onPickedGoogleDriver"
        @handleFile="handleFiles"
        :title="'Edit PDF file'"
        :description="'Add text, shapes, images, and freehand annotations to your PDF using the easiest PDF editor.'"
        :featureImgUrl="svgUrl"
      />
    </div>
    <EditPdfContent
      :pdfUrl="getURL(file)"
      :pageNumProps="pdfPage"
      @upload="upload_png"
      @edit_start="page_load = 'processing'"
      v-if="file"
      v-show="page_load == 'default'"
    />
  </div>
</template>

<script>
import generateURL from "@/services/generateURL";
import EditPdfContent from "@/components/EditPdfContent.vue";
import addImagesToPDF2 from "@/services/add_img_to_pdf2";
import Processing from "@/components/Processing.vue";
import Uploading from "@/components/Uploading.vue";
import { fileHandlingMixin } from "@/config/globalMixin.js";
import getPageNumber from "@/services/getPageNumber";
import SelectFileComponent from "@/components/SelectFileComponent.vue";
import SvgImage from "@/assets/feature_img/edit_pdf.svg";
export default {
  
  head() {
    return {
      title: "Online PDF Editor - Easily Edit your PDF Files for Free",
      link: [{ rel: "canonical", href: "https://www.pdfden.com/edit-pdf" }],
      script: [
        {
          type: 'application/ld+json',
          json: {
            "@context": "https://schema.org/",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "PDFden",
                "item": "https://pdfden.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Edit PDF file",
                "item": "https://pdfden.com/edit-pdf"
              }
            ]
          }
        }
      ],
      meta: [
        {
          name: "Keywords",
          content:
            "Edit PDF, online PDF editor, PDF editing tool, modify PDF, edit text in PDF, add images to PDF, PDF document editor, pdf form filler, pdf filler",
        },
        {
          name: "description",
          content: "Using our free Online PDF Editor, you can Edit your PDFs online. Modify text, shapes, images, and freehand annotations to your PDF. Try it now!",
        },
        {
          property: "og:description",
          content: "Using our free Online PDF Editor, you can Edit your PDFs online. Modify text, shapes, images, and freehand annotations to your PDF. Try it now!",
        },
        {
          property: "og:title",
          content: "Online PDF Editor - Easily Edit your PDF Files for Free",
        },
        {
          vmid: "edit_image",
          property: "image",
          content: "https://pdfden.com/editpdf.png",
        },
        {
          vmid: "edit_facebook_image",
          property: "og:image",
          content: "https://pdfden.com/editpdf.png",
        },
        {
          vmid: "edit_twitter_image",
          property: "twitter:image",
          content: "https://pdfden.com/editpdf.png",
        },
      ],
    };
  },

  mixins: [fileHandlingMixin],
  components: {
    EditPdfContent,
    Processing,
    SelectFileComponent,
    Uploading,
  },
  data() {
    return {
      isDragging: false,
      file: null,
      get_result: false,
      page_load: "default",
      pdfPage: null,
      size: 0,
      svgUrl: SvgImage,
      progress: 0,
    };
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      // Mobile responsive design - no redirect needed
      // The page will now work on all screen sizes
    },
    async handleFiles(files) {
      if (files.length > 1) {
        this.$swal(
          "Sorry!",
          "PDFden cannot process  more than one files in a task.",
          "warning"
        );
        return;
      } else {
        this.pdfPage = await getPageNumber(files[0]);
        this.file = files[0];
      }
    },

    getURL(file) {
      const fileSrc = generateURL(file);
      return fileSrc;
    },
    get_edit_result() {
      this.get_result = true;
    },

    async upload_png(data) {
      console.log(data);
      const pdf = await addImagesToPDF2(this.getURL(this.file), data);
      await this.upload_pdf(pdf);
    },
    upload_pdf(pdf) {
      const formData = new FormData();
      formData.append("pdf", pdf);
      this.page_load = "uploading";
      this.$axios
        .post("/pdf/pdf_upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: function (progressEvent) {
            this.progress = parseInt(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );
            this.size = progressEvent.total;
          }.bind(this),
        })
        .then((response) => {
          const obj = {
            id: response.data,
            button_title: "Successfully Edited",
            dis_text: "PDF has been edited!",
            down_name: `${this.file.name.split(".")[0]}_edited.pdf`,
            file_type: "application/pdf",
            before: "editpdf",
          };
          const encrypted = this.$crypto.AES.encrypt(
            JSON.stringify(obj),
            "mySecretKey123"
          ).toString();
          // const encrypted = this.$encrypt(obj);

          this.$router.push({
            path: "download",
            // this.$route.params.locale == undefined
            //   ? "download"
            //   : "en_download",
            query: {
              param: encrypted,
            },
          });
        })
        .catch((e) => {
          this.page_load = "default";
          this.$swal("Server Error!", "Please check your Network.", "Warning");
        });
    },
  },
};
</script>

<style scoped>
.md-radio {
  display: flex;
}

.edit-title {
  margin-top: 50px;
  border-bottom: solid 1px #eee;
}

.edit-desc-title {
  text-align: left;
  font-size: 24px;
  margin-left: 30px;
  margin-top: 10px;
}

.edit-desc-detail {
  background-color: #def2ff;
  padding: 24px;
  color: #161616;
  margin: 30px;
  border-radius: 5px;
}

.upload_btn {
  width: fit-content;
  display: flex;
  text-align: center;
  margin: auto;
  position: relative;
  cursor: pointer;
}

.upload_btn .md-button-content {
  font-size: 22px;
  font-weight: 600;
  padding: 0 30px;
}

.option__panel__content {
  margin: 10px;
  background: #def2ff;
  padding: 10px;
  border-radius: 5px;
  font-size: 13px;
}

.edit-btn {
  font-size: 22px;
  line-height: 26px;
  min-height: 48px;
  padding: 8px 12px;
  color: #fff;
  background-color: #0000ff;
  padding: 15px 40px;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  margin-left: 100px;
  margin-top: 100px;
}

.edit-title {
  border-bottom: 1px solid #ccc !important;
}

/* Responsive Design for Mobile */
@media (max-width: 1024px) {
  .main {
    padding: 10px;
  }
  
  .edit-desc-title {
    font-size: 20px;
    margin-left: 15px;
  }
  
  .edit-desc-detail {
    margin: 15px;
    padding: 15px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .main {
    padding: 5px;
  }
  
  .edit-desc-title {
    font-size: 18px;
    margin-left: 10px;
  }
  
  .edit-desc-detail {
    margin: 10px;
    padding: 12px;
    font-size: 13px;
  }
  
  .edit-btn {
    margin-left: 0;
    margin-top: 20px;
    width: 100%;
    padding: 12px 20px;
    font-size: 18px;
  }
}

@media (max-width: 640px) {
  .main {
    padding: 5px;
    width: 100%;
  }
  
  .edit-desc-title {
    font-size: 16px;
    margin-left: 5px;
    text-align: center;
  }
  
  .edit-desc-detail {
    margin: 5px;
    padding: 10px;
    font-size: 12px;
  }
  
  .edit-btn {
    margin-left: 0;
    margin-top: 15px;
    width: 100%;
    padding: 10px 15px;
    font-size: 16px;
  }
  
  .upload_btn .md-button-content {
    font-size: 18px;
    padding: 0 20px;
  }
}

@media (max-width: 480px) {
  .main {
    padding: 2px;
  }
  
  .edit-desc-title {
    font-size: 14px;
    margin-left: 2px;
  }
  
  .edit-desc-detail {
    margin: 2px;
    padding: 8px;
    font-size: 11px;
  }
  
  .edit-btn {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .upload_btn .md-button-content {
    font-size: 16px;
    padding: 0 15px;
  }
}
</style>
