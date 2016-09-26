<script>
    function deleteToken(e) {
        localStorage.clear()
    }

    window.addEventListener('message', deleteToken);
</script>