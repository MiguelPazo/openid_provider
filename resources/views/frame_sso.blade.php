<script>
    window.onload = function () {
        var token = localStorage.getItem('app_token');
        parent.postMessage(token, '*');
    }
</script>