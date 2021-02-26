INLINE_RUNTIME_CHUNK=false npm run build

pushd build/static/js

mv -f 2*.js vendor.label-table.js
mv -f main*.js main.label-table.js
mv -f runtime~main*.js runtime.label-table.js

popd

serve -l 5002 build
