<template>
  <div class="top-toolbar">
    <div class="top-toolbar-content">
      <!-- Logo Section -->
      <div class="logo-section">
        <img :src="logoUrl" alt="PDF EZY" class="logo" @error="onImageError" />
      </div>
      
      <!-- Download Button -->
      <div class="download-section">
        <button 
          class="download-btn" 
          @click="$emit('download')"
          :disabled="isRendering"
        >
          <span class="download-text">DOWNLOAD</span>
          <i class="fa fa-arrow-right download-icon"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopToolBar',
  props: {
    isRendering: {
      type: Boolean,
      default: false
    }
  },
  emits: ['download'],
  data() {
    return {
      logoUrl: null
    }
  },
  computed: {
    logoSrc() {
      try {
        return require('~/assets/img/logo.svg')
      } catch (e) {
        console.error('Could not load logo:', e)
        return '/logo.svg'
      }
    }
  },
  mounted() {
    this.logoUrl = this.logoSrc
  },
  methods: {
    onImageError() {
      console.error('Logo failed to load:', this.logoUrl)
      // Fallback to static path
      this.logoUrl = '/logo.svg'
    }
  }
}
</script>

<style scoped>
.top-toolbar {
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.top-toolbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  height: 60px;
  width: auto;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  letter-spacing: -0.5px;
}

.download-section {
  display: flex;
  align-items: center;
}

.download-btn {
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(255, 107, 53, 0.3);
}

.download-btn:hover:not(:disabled) {
  background: #e55a2b;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 107, 53, 0.4);
}

.download-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(255, 107, 53, 0.3);
}

.download-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.download-text {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.download-icon {
  font-size: 14px;
  transition: transform 0.2s ease;
}

.download-btn:hover:not(:disabled) .download-icon {
  transform: translateX(2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .top-toolbar-content {
    padding: 10px 16px;
  }
  
  .logo {
    height: 32px;
  }
  
  .logo-text {
    font-size: 20px;
  }
  
  .download-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .top-toolbar-content {
    padding: 8px 12px;
  }
  
  .logo-section {
    gap: 8px;
  }
  
  .logo {
    height: 28px;
  }
  
  .logo-text {
    font-size: 18px;
  }
  
  .download-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .download-text {
    display: none;
  }
  
  .download-btn {
    padding: 8px 12px;
  }
}
</style>
