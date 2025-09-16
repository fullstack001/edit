<template>
  <div>
    <Processing :progress="'Loading file...'" v-if="page_load == 'loading'" />
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
      <div v-if="!file && page_load == 'default'" class="error-message">
        <h1>No file found</h1>
        <p>Please provide a valid processingId in the URL</p>
      </div>
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
import getPageNumber from "@/services/getPageNumber";
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
      
    };
  },

  components: {
    EditPdfContent,
    Processing,
    Uploading,
  },
  data() {
    return {
      file: null,
      get_result: false,
      page_load: "loading",
      pdfPage: null,
      size: 0,
      progress: 0,
      processingId: null,
    };
  },
  async mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    await this.loadFileFromUrl();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      // Mobile responsive design - no redirect needed
      // The page will now work on all screen sizes
    },
    async loadFileFromUrl() {
      try {
        // Get processingId from URL query parameter
        this.processingId = this.$route.query.file;
        
        if (!this.processingId) {
          this.page_load = "default";
          return;
        }

        // Fetch file from API
        const response = await this.$axios.get(`https://api.pdfezy.com/api/pdf/temp-file/${this.processingId}`, {
          responseType: 'blob'
        });

        // Create a File object from the blob response
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const file = new File([blob], `file_${this.processingId}.pdf`, { type: 'application/pdf' });
        
        // Get page number and set file
        this.pdfPage = await getPageNumber(file);
        this.file = file;
        this.page_load = "default";
        
      } catch (error) {
        console.error('Error loading file:', error);
        this.page_load = "default";
        this.$swal("Error!", "Failed to load file. Please check the processingId.", "error");
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
      const pdf = await addImagesToPDF2(this.getURL(this.file), data);
      await this.upload_pdf(pdf);
    },
    upload_pdf(pdf) {
      const formData = new FormData();
      
      // Create filename with original name + timestamp
      const originalName = this.file.name.replace('.pdf', '');
      const timestamp = Date.now();
      const newFilename = `${originalName}_${timestamp}.pdf`;
      
      // Create a new File object with the new filename
      const fileWithNewName = new File([pdf], newFilename, { type: 'application/pdf' });
      
      formData.append("pdf", fileWithNewName);
      formData.append("processingId", this.processingId);
      this.page_load = "uploading";
      this.$axios
        .post("/pdf/pdf_upload_with_processingId", formData, {
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
          // Redirect to success page on different domain with processingId
          window.location.href = `http://localhost:3065/en/success-edit/?file=${this.processingId}`;
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
}

.error-message {
  text-align: center;
  padding: 50px 20px;
  color: #666;
}

.error-message h1 {
  font-size: 32px;
  margin-bottom: 20px;
  color: #333;
}

.error-message p {
  font-size: 18px;
  line-height: 1.5;
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
