$(document).ready(function() {
   $('#startHrs').change(computeIt);
   $('#regInef').change(computeIt);
   $('#agOver').change(computeIt);

   $('#regMtg').change(computeIt);
   $('#adhoc').change(computeIt);
   $('#pto').change(computeIt);

   $('#compute').click(computeIt);

   computeIt();
});

function computeIt()
{
   $('#firstSubtotal').text(parseInt($('#startHrs').val()) - parseInt($('#regInef').val()) - parseInt($('#agOver').val()));

   var subt1 = $('#firstSubtotal').text();

   var hrs2=0;
   hrs2 += parseFloat($('#regMtg').val());
   hrs2 += parseFloat($('#adhoc').val());
   hrs2 += parseFloat($('#pto').val());

   var subt2 = subt1-hrs2;

   $('#secondSubtotal').text(subt2);

   var ogs = Math.round(subt2*.30);
   $('#spt').text(ogs);

   $('#total_capacity_txt').text(subt2-ogs);
}

function UrlExists(url)
{
   var http = new XMLHttpRequest();
   http.open('HEAD', url, false);
   http.send();
   return http.status!=404;
}
