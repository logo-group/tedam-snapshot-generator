var arrLang = {
    'en': {
      'settings': 'Settings',
      'addRule': 'Add Rule',
      'defineRule': 'Define Rule',
      'cancel': 'Cancel',
      'exportConfigFile':'Export Config File',
      'updateConfigFile':'Update Config File',
      'step1':'Step 1 : Define Finds',
      'step2':'Step 2 : Define Tag',
      'step3':'Step 3 : Define Title',
      'step4':'Step 4 : Define Value',
      'step5':'Step 5 : Define Enabled',
      'cancel1':'Cancel',
      'previous':'Previous',
      'next':'Next',
      'finish':'Finish',
      'findsType':'Finds Type',
      'querySelector':'Query Selector',
      'querySelector1':'Query Selector',
      'querySelector2':'Query Selector',
      'querySelector3':'Query Selector',
      'step1of5':'Step 1 of 5',
      'step' : 'Step',
      'addExtract':'Add Extract',
      'addExtract1':'Add Extract',
      'addExtract2':'Add Extract',
      'nodeType': 'Node Type',
      'nodeTypeValue': 'Node Type Value',
      'operatortype' : 'Operator Type',
      'startIndex':'Start Index',
      'startadd' : 'Start Add',
      'endAdd': 'End Add',
      'endIndex' :'End Index',
      'findparameter': 'Find Parameter',
      'findparameterpanel' :'Find Parameter Panel',
      'findstypevalue': 'Finds Type Value',
      'startregex':'Start Regex',
      'value':'Value',
      'addquery':'Add Query',
      'wrapper':'Wrapper',
      'startindex':'Start Index',
      'startadd1' : 'Start Add',
      'endAdd1': 'End Add',
      'endIndex1' :'End Index',
      'endRegex':'End Regex',
      'queryparameterpanel' :'Query Parameter Panel',
      'queryparameter' :'Query Parameter',
      'extractparameterpanel' :'Extract Parameter Panel',
      'remove':'Remove',
      'remove1':'Remove',
      'remove2':'Remove',
      'remove3':'Remove',
      'addFind' :'Add Find',
      'define': 'Define',
      'click':'Click',
      'configFileName': 'Filename for the Config File...',
      'FormName': 'FormName',
      'Version': 'Version',
      'Click': 'Click',
      'Read':'Read',
      'Write': 'Write'




    },
    'tr': {
      'settings': 'Ayarlar',
      'addRule': 'Kural Ekle',
      'defineRule': 'Kural Tanımla',
      'cancel' : 'Çıkış',
      'exportConfigFile':'Dosyayı Dışa Aktar',
      'updateConfigFile':'Dosyayı Güncelleştir',
      'step1':'Basamak 1 : Bulguları Tanımla',
      'step2':'Basamak 2 : Etiketi Tanımla',
      'step3':'Basamak 3 : Başlığı Tanımla',
      'step4':'Basamak 4 : Değeri Tanımla',
      'step5':'Basamak 5 : İzni Tanımla',
      'cancel1' :'Çıkış',
      'previous':'Önceki',
      'next':'İleri',
      'finish':'Bitti',
      'findsType':'Türü Bul',
      'querySelector':'Sorgu Seçici',
      'querySelector1':'Sorgu Seçici',
      'querySelector2':'Sorgu Seçici',
      'querySelector3':'Sorgu Seçici',
      'step1of5':'Basamak 1/5',
      'step' : 'Basamak',
      'addExtract':'Extract Ekle',
      'addExtract1':'Extract Ekle',
      'addExtract2':'Extract Ekle',
      'nodeType': 'Düğüm Türü',
      'nodeTypeValue': 'Düğüm Türü Değeri',
      'operatortype' : 'Operatör Tipi',
      'startIndex' : 'Dizini Başlat',
      'startadd' : 'Eklemeye Başla',
      'endAdd': 'Eklemeyi Sonlandır',
      'endIndex' :'İndeks Sonu',
      'findparameter': 'Parametre Bul',
      'findparameterpanel' :'Parametre Panelini Bul',
      'findstypevalue': 'Türün Değerini Bul',
      'startregex':'Regexi Başlat',
      'value':'Değer',
      'addquery':'Sorgu Ekle',
      'wrapper':'Sarıcı',
      'startindex':'İndeksi Başlat',
      'startadd1' : 'Eklemeye Başla',
      'endAdd1': 'Eklemeyi Sonlandır',
      'endIndex1' :'İndeks Sonu',
      'endRegex':'Regeksi Sonlandır',
      'queryparameterpanel' :'Sorgu Parametre Paneli',
      'queryparameter' :'Sorgu Parametresi',
      'extractparameterpanel' :'Parametre Panelini Çıkar',
      'remove':'Kaldır',
      'remove1':'Kaldır',
      'remove2':'Kaldır',
      'remove3':'Kaldır',
      'addFind' :'Bulma Ekle',
      'define': 'Tanımla',
      'click':'Tıkla',
      'configFileName': 'Config dosyası için dosya adı...',
      'FormName': 'FormAdı',
      'Version': 'Versiyon',
      'Click': 'Tıkla',
      'Read':'Oku',
      'Write': 'Yaz'

    }
  };

  // Process translation
  $(function() {
    $('#mySelect').change(function() {
      var lang = $('option:selected', this).attr('id');
      $('[key]').each(function(index, item) {
        $(this).text(arrLang[lang][$(this).attr('key')]);
      });
      changePlaceHolder(lang);
      changeConst(lang);
    });
  });

  function changePlaceHolder(lang) {
    $('[placeholderkey]').each(function(index, item) {
      $(this).attr('placeholder', arrLang[lang][$(this).attr('placeholderkey')]);
    });
 }
