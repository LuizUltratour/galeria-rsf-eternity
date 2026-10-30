(function (w, d) {
  'use strict';

  var GALLERY_URL        = 'https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/rsf/galeria-eternity/index.html';
  var VIDEO_GALLERY_URL  = 'https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/rsf/galeria-eternity/video-gallery.html';
  var GALERIA_360_URL    = 'https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/rsf/galeria-eternity/galeria-360.html';
  var DIFERENCIAIS_URL   = 'https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/rsf/galeria-eternity/diferenciais.html';
  var OBRAS_URL          = 'https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/rsf/galeria-eternity/obras.html';

  var overlay    = null;
  var msgHandler = null;

  function _injectStyles() {
    if (d.getElementById('_gc_styles')) return;
    var s = d.createElement('style');
    s.id = '_gc_styles';
    s.textContent =
      '@keyframes _gcIn{from{opacity:0}to{opacity:1}}' +
      '@keyframes _gcOut{to{opacity:0}}';
    d.head.appendChild(s);
  }

  function _open(mode) {
    if (overlay) _close();
    _injectStyles();

    overlay = d.createElement('div');
    overlay.id = '_gc_overlay';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483646;' +
      'animation:_gcIn 0.3s ease both;';

    var iframe = d.createElement('iframe');
    iframe.src  = GALLERY_URL + '?mode=' + encodeURIComponent(mode || 'imagens');
    iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;background:#BC6C49;';
    iframe.setAttribute('allow', 'fullscreen');

    overlay.appendChild(iframe);
    d.body.appendChild(overlay);

    msgHandler = function (e) {
      if (e.data && e.data.action === 'closeGallery') _close();
    };
    w.addEventListener('message', msgHandler);
  }

  function _close() {
    if (!overlay) return;
    overlay.style.animation = '_gcOut 0.25s ease forwards';
    var ref = overlay;
    setTimeout(function () {
      if (ref.parentNode) ref.parentNode.removeChild(ref);
    }, 260);
    overlay = null;
    if (msgHandler) {
      w.removeEventListener('message', msgHandler);
      msgHandler = null;
    }
  }

  // ── API pública ──────────────────────────────────────────────
  // GaleriaImagens(1) → abre galeria de imagens
  // GaleriaImagens(0) → fecha
  w.GaleriaImagens = function (show) {
    if (show === 1) _open('imagens'); else _close();
  };

  // GaleriaPlantas(1) → abre galeria de plantas
  // GaleriaPlantas(0) → fecha
  w.GaleriaPlantas = function (show) {
    if (show === 1) _open('plantas'); else _close();
  };

  // AbrirGaleriaVideos(1) → abre galeria de vídeos
  // AbrirGaleriaVideos(0) → fecha
  w.AbrirGaleriaVideos = function (show) {
    if (show !== 1) { _close(); return; }
    if (overlay) _close();
    _injectStyles();

    overlay = d.createElement('div');
    overlay.id = '_gc_overlay';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483646;' +
      'animation:_gcIn 0.3s ease both;';

    var iframe = d.createElement('iframe');
    iframe.src = VIDEO_GALLERY_URL + '?v=' + Date.now();
    iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;background:#000;';
    iframe.setAttribute('allow', 'fullscreen; autoplay');

    overlay.appendChild(iframe);
    d.body.appendChild(overlay);

    msgHandler = function (e) {
      if (e.data && e.data.action === 'closeGallery') _close();
    };
    w.addEventListener('message', msgHandler);
  };

  // Galeria360(1) → abre galeria de imagens 360° (setas de navegação entre panoramas)
  // Galeria360(0) → fecha
  w.Galeria360 = function (show) {
    if (show !== 1) { _close(); return; }
    if (overlay) _close();
    _injectStyles();

    overlay = d.createElement('div');
    overlay.id = '_gc_overlay';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483646;' +
      'animation:_gcIn 0.3s ease both;';

    var iframe = d.createElement('iframe');
    iframe.src = GALERIA_360_URL + '?v=' + Date.now();
    iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;background:#BC6C49;';
    iframe.setAttribute('allow', 'fullscreen; gyroscope; accelerometer');

    overlay.appendChild(iframe);
    d.body.appendChild(overlay);

    msgHandler = function (e) {
      if (e.data && e.data.action === 'closeGallery') _close();
    };
    w.addEventListener('message', msgHandler);
  };

  // AbrirDiferenciais(1) → abre tela de diferenciais
  // AbrirDiferenciais(0) → fecha
  w.AbrirDiferenciais = function (show) {
    if (show !== 1) { _close(); return; }
    if (overlay) _close();
    _injectStyles();

    overlay = d.createElement('div');
    overlay.id = '_gc_overlay';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483646;' +
      'animation:_gcIn 0.3s ease both;';

    var iframe = d.createElement('iframe');
    iframe.src = DIFERENCIAIS_URL + '?v=' + Date.now();
    iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;background:#BC6C49;';
    iframe.setAttribute('allow', 'fullscreen');

    overlay.appendChild(iframe);
    d.body.appendChild(overlay);

    msgHandler = function (e) {
      if (e.data && e.data.action === 'closeGallery') _close();
    };
    w.addEventListener('message', msgHandler);
  };

  // AbrirObras(1) → abre o andamento da obra (obras.html — somente Eternity Residence)
  // AbrirObras(0) → fecha
  w.AbrirObras = function (show) {
    if (show !== 1) { _close(); return; }
    if (overlay) _close();
    _injectStyles();

    overlay = d.createElement('div');
    overlay.id = '_gc_overlay';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483646;' +
      'animation:_gcIn 0.3s ease both;';

    var iframe = d.createElement('iframe');
    iframe.src = OBRAS_URL + '?v=' + Date.now();
    iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;background:#F7F0EA;';
    iframe.setAttribute('allow', 'fullscreen');

    overlay.appendChild(iframe);
    d.body.appendChild(overlay);

    msgHandler = function (e) {
      if (e.data && e.data.action === 'closeGallery') _close();
    };
    w.addEventListener('message', msgHandler);
  };

}(window, document));
